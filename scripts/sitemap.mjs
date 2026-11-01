// Face public/sitemap.xml cu pagina principală, categoriile și toate produsele.
// Rulează automat înainte de fiecare „npm run build”.
// Adresele vin din aceleași nume ca pe site (src/App.jsx -> PRODUCT_INFO și CATEGORIES).
import { readFile, readdir, writeFile } from "node:fs/promises";
import { assignSlugs, productPath, slugify } from "../src/slug.js";

const SITE = "https://www.hosmanflowers.md";
const root = new URL("..", import.meta.url);

const app = await readFile(new URL("src/App.jsx", root), "utf8");
const names = {};
for (const m of app.matchAll(/^ {2}(\d+):\s*\{\s*\r?\n\s*name:\s*"([^"]+)"/gm)) names[+m[1]] = m[2];

// categoriile: { title: "...", ... nums: [1, 2] }
const catBlock = app.match(/const CATEGORIES = \[([\s\S]*?)\n\];/)[1];
const categories = [...catBlock.matchAll(/\{\s*title:\s*"([^"]+)"[^\n]*?nums:\s*\[([^\]]*)\]/g)]
  .map((m) => ({ title: m[1], nums: m[2].split(",").map((n) => +n.trim()).filter(Boolean) }));

// doar produsele care au poză (la fel ca pe site)
const files = await readdir(new URL("src/assets/produse/", root));
const nums = [...new Set(files.map((f) => f.match(/^produs(\d+)\.(jpe?g|png|webp)$/i)?.[1]).filter(Boolean).map(Number))]
  .sort((a, b) => a - b);

const slugs = assignSlugs(nums.map((num) => ({ num, name: names[num] })));
const pathOf = (num) => {
  const cat = categories.find((c) => c.nums.includes(num));
  return cat ? `/categorie/${slugify(cat.title)}/${slugs[num]}` : productPath(slugs[num]);
};

const today = new Date().toISOString().slice(0, 10);
const url = (loc, prio) =>
  `  <url>\n    <loc>${SITE}${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${prio}</priority>\n  </url>`;

const catPaths = [
  ...categories.filter((c) => c.nums.some((n) => nums.includes(n))).map((c) => `/categorie/${slugify(c.title)}`),
  "/categorie/rasaduri-de-flori",
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  url("/", "1.0"),
  ...catPaths.map((p) => url(p, "0.9")),
  ...nums.map((n) => url(pathOf(n), "0.8")),
  "</urlset>",
  "",
].join("\n");

await writeFile(new URL("public/sitemap.xml", root), xml);
console.log(`sitemap.xml: ${1 + catPaths.length + nums.length} adrese`);
