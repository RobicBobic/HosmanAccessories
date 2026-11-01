/* ============================================================
   ADRESELE PRODUSELOR (ex. /produs/ghiveci-tip-bol-din-plastic)
   Se fac automat din numele produsului. Le folosește și site-ul,
   și scriptul care face sitemap.xml (scripts/sitemap.mjs).
   ============================================================ */

// „Ghiveci înalt din plastic (RO)” -> „ghiveci-inalt-din-plastic-ro”
export function slugify(text) {
  const s = (text || "")
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "") // fără diacritice
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (s.length <= 90) return s;
  return s.slice(0, 90).replace(/-[^-]*$/, ""); // scurtat la un cuvânt întreg
}

// list = [{ num, name }] în ordinea numerelor -> { num: slug }, fără dubluri
export function assignSlugs(list) {
  const used = new Set();
  const out = {};
  for (const p of list) {
    let slug = slugify(p.name) || `produs-${p.num}`;
    if (used.has(slug)) slug = `${slug}-${p.num}`;
    used.add(slug);
    out[p.num] = slug;
  }
  return out;
}

export const productPath = (slug) => `/produs/${slug}`;
