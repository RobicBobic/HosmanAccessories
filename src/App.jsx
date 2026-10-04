import { useState, useEffect, useLayoutEffect } from "react";

/* Derulare INSTANT (fără animație). Site-ul are „scroll-behavior: smooth”,
   iar derularea animată se oprea uneori la mijlocul paginii când se schimba
   conținutul (de ex. la deschiderea unui produs). */
function jumpTo(top = 0) {
  const root = document.documentElement;
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  void root.offsetHeight; // aplică imediat stilul de mai sus
  try {
    window.scrollTo({ top, left: 0, behavior: "instant" });
  } catch {
    window.scrollTo(0, top);
  }
  root.style.scrollBehavior = prev;
}
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductPage from "./ProductPage";
import ContactButton from "./ContactButton";
import "./App.css";

/* ============================================================
   HOSMAN ACCESSORIES - stil inspirat de compaqpeat, în română
   Stilurile sunt în App.css
   ============================================================ */

/* ============================================================
   HERO (slider) - se încarcă AUTOMAT din folder.
   ------------------------------------------------------------
   Ca să adaugi / scoți o imagine în slider NU trebuie să atingi codul:
     1. Pune imaginile în:  src/assets/hero/
     2. Numește-le:  hero1.jpg, hero2.jpg, hero3.jpg ...
     3. Gata. Apar automat, în ordine numerică, câte pui.
        - Scoți o imagine  -> ștergi fișierul ei.
        - Adaugi o imagine -> pui heroN.jpg (următorul număr).
   Merge cu .jpg, .jpeg, .png, .webp.
   ============================================================ */
const heroModules = import.meta.glob(
  "./assets/hero/hero*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default" }
);

const SLIDES = Object.entries(heroModules)
  .map(([path, img]) => ({
    num: parseInt(path.match(/hero(\d+)/i)?.[1] ?? "0", 10),
    img,
  }))
  .sort((a, b) => a.num - b.num);

/* ============================================================
   COLABORATORI - se încarcă AUTOMAT din folder.
   ------------------------------------------------------------
   Ca să adaugi / scoți un partener NU trebuie să atingi codul:
     1. Pune imaginile în:  src/assets/parteneri/
     2. Numește-le:  partener1.png, partener2.png, partener3.png ...
     3. Gata. Apar automat, în ordine numerică.
        - Scoți un partener  -> ștergi fișierul lui.
        - Adaugi un partener -> pui partenerN.png (următorul număr).
   Merge cu .png, .jpg, .jpeg, .webp, .svg.
   ============================================================ */
const partnerModules = import.meta.glob(
  "./assets/parteneri/partener*.{png,jpg,jpeg,webp,svg}",
  { eager: true, import: "default" }
);

/* OPȚIONAL: dacă vrei ca un logo să ducă spre site-ul partenerului,
   scrie linkul la numărul lui aici. Dacă lași gol, e doar imaginea. */
const PARTNER_LINKS = {
  // 1: "https://exemplu.com",
  // 2: "https://alt-partener.com",
};

const PARTNERS = Object.entries(partnerModules)
  .map(([path, src]) => {
    const num = parseInt(path.match(/partener(\d+)/i)?.[1] ?? "0", 10);
    return { num, src, url: PARTNER_LINKS[num] };
  })
  .sort((a, b) => a.num - b.num);

/* ============================================================
   CATALOG - produsele se încarcă AUTOMAT din folder.
   ------------------------------------------------------------
     1. Pune pozele în:  src/assets/produse/
     2. Numește-le:  produs1.jpg, produs2.jpg, produs3.jpg ...
     3. Detaliile (nume / descriere / preț) le scrii mai jos, la
        numărul potrivit. Dacă lași gol, apare doar poza + "Produs N".
   Adaugi un produs -> pui produsN.jpg și, opțional, un rând aici.
   Scoți un produs  -> ștergi poza (și rândul, dacă vrei).
   Merge cu .jpg, .jpeg, .png, .webp.
   ============================================================ */
const productImages = import.meta.glob(
  "./assets/produse/produs*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default" }
);

/* Detalii per produs, după numărul din numele pozei (produs1 -> 1). */
const PRODUCT_INFO = {
  1: {
    name: "Folie alb-negru",
    origin: { country: "Netherlands", code: "nl" },
    desc: "Folie alb-negru pentru prevenirea creșterii nedorite a rădăcinilor și a algelor, protejând și prelungind durata de viață a jgheaburilor de cultură.",
    // --- pagina de detalii ---
    intro: "Folie din polietilenă laminată (40 microni), albă deasupra și neagră dedesubt. Partea neagră stă în contact cu solul și previne creșterea buruienilor, iar partea albă atrage lumina soarelui și menține temperatura corectă, stimulând creșterea plantelor și maturarea fructelor.",
    features: ["Dublă față (alb/negru)", "Prietenoasă cu mediul", "Impermeabilă", "Susține creșterea plantelor"],
    youtube: { 8: "https://www.youtube.com/watch?v=T5opH26ctwc&t=3s" },
    advantages: [
      "Previne creșterea buruienilor, în mod ecologic",
      "Atrage lumina solară și susține creșterea și maturarea plantelor",
      "Menține solul mai rece și reduce consumul de apă la irigare",
      "Ține afidele la distanță, deoarece culoarea albă le dezorientează",
      "Nu arde plantele tinere",
      "Previne depunerea îngrășămintelor pe jgheabul de cultură",
      "Împiedică creșterea nedorită a rădăcinilor și reduce riscul de transmitere a virusurilor și bolilor",
      "Prelungește durata de viață a jgheabului, deoarece stratul acestuia este mai puțin afectat",
      "Jgheaburile de cultură se curăță rapid la rotația culturilor",
      "Montare rapidă, cu un bloc de comutare special dezvoltat",
    ],
    specs: [
      { k: "Brand", v: "Tenax" },
      { k: "Lățime", v: "7 metri" },
      { k: "Lungime", v: "200 metri" },
      { k: "Grosime", v: "40 microni" },
      { k: "Structură", v: "Albă deasupra, neagră dedesubt" },
      { k: "Permeabilitate", v: "Impermeabilă" },
      { k: "Culori", v: "Alb-negru" },
    ],
    // flyer: "/flyere/folie-alb-negru.pdf",
  },
  2: {
    name: "Plasă de susținere pentru plante cățărătoare",
    origin: { country: "Netherlands", code: "nl" },
    desc: "Plasă rezistentă pentru susținerea legumelor cățărătoare, care asigură o ventilație optimă, expunere uniformă la lumină și utilizarea eficientă a spațiului.",
    intro: "Plasă din plastic de înaltă calitate care a revoluționat cultivarea legumelor cățărătoare, înlocuind plasele metalice, spalierele de fier și materialele perisabile precum bambusul sau lemnul. Este realizată din polipropilenă de top, printr-un proces exclusiv de extrudare și bi-întindere, care îi asigură rezistență și durabilitate excelente, potrivită pentru toate tehnicile de cultivare. Ușoară și simplu de instalat, stabilizată UV și rezistentă la bacterii, substanțe chimice și mucegai, oferă ventilație optimă, expunere corectă la lumină și folosirea mai eficientă a spațiului, îmbunătățind creșterea plantelor și recoltarea.",
    features: ["Anti-UV", "Pentru plante cățărătoare", "Rezistentă", "Calitate superioară"],
    advantages: [
      "Din polipropilenă de calitate superioară, prin extrudare și bi-întindere, pentru rezistență și durabilitate excelente",
      "Ușoară, ușor de mutat și de instalat",
      "Stabilizată UV",
      "Rezistentă la bacterii, substanțe chimice și mucegai",
      "Crește expunerea la lumina soarelui și favorizează fotosinteza",
      "Îmbunătățește circulația aerului",
      "Permite o recoltă mai bogată",
      "Produsul cultivat nu rămâne pe sol și nu este călcat",
      "Reduce bolile plantelor și consumul de agrochimicale",
      "Îmbunătățește calitatea legumelor",
      "Reduce semnificativ munca față de folosirea rafiei și a sârmei metalice",
    ],
    experimentTitle: "Experiment făcut de specialiști",
    experimentText:
      "Plasa a fost supusă unui test de îmbătrânire accelerată în laborator, care a simulat doi ani de expunere la o radiație medie de 5500 MJ (megajouli) pe m², corespunzătoare condițiilor climatice din bazinul mediteraneean. Rezultatele au fost extraordinare: firul transversal a păstrat 85% din rezistența inițială la tracțiune, iar firul longitudinal a păstrat 100% din rezistență, fără nicio deteriorare.",
    specs: [
      { k: "Brand", v: "Tenax" },
      { k: "Material", v: "Polipropilenă de calitate superioară" },
      { k: "Culoare", v: "Alb" },
      { k: "Stabilizare UV", v: "Da" },
      { k: "Rezistență", v: "La bacterii, substanțe chimice și mucegai" },
    ],
    sizes: [
      { cod: "58014509", dim: "1 × 1.000 m", culoare: "Alb" },
      { cod: "58012507", dim: "1,02 × 1.000 m", culoare: "Alb" },
      { cod: "58012508", dim: "1,19 × 1.000 m", culoare: "Alb" },
      { cod: "58014511", dim: "1,25 × 1.000 m", culoare: "Alb" },
    ],
  },
  3: {
    name: "Mașină de pulverizare pentru sere 20L",
    origin: { country: "Turkey", code: "tr" },
    fit: "contain", // poza e pe fundal alb -> se vede întreagă, fără zoom-crop
    heroPos: "50% 22%", // ce parte din poza de hero se vede (aici: spre partea de sus, ca să apară duzele + ceața)
    desc: "Echipament ULV pentru sere, care pulverizează soluția în particule foarte fine, asigurând o dispersie uniformă și o combatere eficientă a dăunătorilor.",
    // --- pagina de detalii ---
    intro: "Sera Plus 20 U.L.V. pulverizează soluția de tratament sub formă de particule cu dimensiuni foarte mici, de ordinul micronilor, ceea ce crește semnificativ probabilitatea ca substanța să intre în contact cu dăunătorii, comparativ cu alte echipamente. Datorită distanței mari de dispersie a particulelor, echipamentul poate acționa eficient asupra dăunătorilor zburători chiar și la distanțe mai mari, contribuind la combaterea acestora.",
    features: ["Tehnologie U.L.V.", "2 capete de pulverizare", "Rezervor 20 L", "Portabil, cu temporizator"],
    youtube: { 4: "https://youtu.be/98duXM6_lNQ" }, // slide video YouTube (nr = poziția în slideshow)

    coverTitle: "Ce înseamnă tehnologia U.L.V.?",
    coverText:
      "Multe echipamente pe roți pulverizează picături de aproximativ 100 de microni - prea mari și prea grele: nu plutesc în aer, cad la sol după circa 10 metri și nu ajung la dăunătorii zburători precum Tuta. La păianjenul roșu, care stă pe partea de dedesubt a frunzei, picăturile mari nici nu ajung, așa că dăunătorii continuă să se înmulțească. Sera Plus 20 U.L.V. creează o ceață fină care umple sera în volum (3D), pătrunde sub frunze și în interiorul pânzelor de păianjen și intră în contact direct cu dăunătorii. Astfel, substanța este folosită aproape în totalitate, fără să cadă pe sol, spre deosebire de pulverizatoarele obișnuite, unde până la 90% din soluție ajunge pe pământ sau se scurge de pe plante.",

    advantages: [
      "Poți regla ora de pornire/oprire în funcție de starea serei (are temporizator încorporat)",
      "Nu e nevoie să stai în seră în timpul tratamentului, ceea ce îți protejează sănătatea",
      "Eviți contactul substanței cu pielea și cu căile respiratorii",
      "Economisești până la 50% substanță față de metodele clasice de tratament",
      "Tratează sera de sus până jos, fără să lase dăunătorilor șansa să scape; ceața se prinde între plante și pe partea de dedesubt a frunzelor",
      "Nu varsă apă cu substanță pe sol și reduce semnificativ umiditatea din seră",
      "Poți face tratamente chiar și pe vreme ploioasă, nefavorabilă",
      "Rază mare de dispersie: ceața ajunge până la 30 de metri, inclusiv la dăunătorii zburători aflați la distanță",
      "Prelungește intervalul dintre tratamente de la 7-10 zile la 10-15 zile",
      "Eficient împotriva Tuta, păianjenului roșu, afidelor și a altor insecte",
    ],

    specs: [
      { k: "Brand", v: "DURU" },
      { k: "Model", v: "Sera Plus 20 U.L.V." },
      { k: "Motor", v: "2 × 2000 W (4000 W), 220 V AC" },
      { k: "Alimentare", v: "220 V / 50 Hz" },
      { k: "Capacitate rezervor", v: "20 litri" },
      { k: "Debit soluție", v: "0-49 l/h" },
      { k: "Diametru picătură", v: "0-49 microni" },
      { k: "Distanță de pulverizare", v: "Până la 30 metri" },
      { k: "Soluții compatibile", v: "SC, EC, WP" },
      { k: "Greutate", v: "13 kg" },
      { k: "Dimensiuni (l × L × Î)", v: "52 × 60 × 68 cm" },
      { k: "Șasiu", v: "Profil 20 × 20, vopsit electrostatic" },
      { k: "Caracteristici", v: "Portabil, cu amestecător de soluție și temporizator" },
      { k: "Suprafață acoperită", v: "cca. 2.000 m²" },
    ],
    // flyer: "/flyere/produs3.pdf",
  },
  /* ============================================================
     PRODUSUL 4 - șablon gata de completat.
     Pune poza:  src/assets/produse/produs4.jpg
     Apoi înlocuiește textele de mai jos cu cele reale.
     - Dacă poza e pe fundal ALB (echipament, unealtă), lasă
       fit: "contain" ca să se vadă întreagă, fără crop.
     - Dacă e o poză „de ambianță" (câmp, cultură) care trebuie
       să umple cardul, șterge linia fit: "contain".
     Orice câmp de care NU ai nevoie îl poți șterge - secțiunea
     aferentă din pagina de produs pur și simplu nu apare.
     ============================================================ */
  4: {
    name: "Ventilator anti-umiditate",
    origin: { country: "Turkey", code: "tr" },
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu tăiată)
    sound: false, // videoclipul din slideshow rulează fără sunet (fără buton de sunet)
    desc: "Ventilator profesional pentru sere, conceput pentru evacuarea aerului cald și reducerea umidității, asigurând o circulație eficientă a aerului și un climat optim pentru plante.",
    // --- pagina de detalii ---
    intro: "Ventilator profesional pentru sere, conceput pentru evacuarea aerului cald și reducerea umidității. Menține aerul în mișcare și un climat echilibrat, favorabil creșterii sănătoase a plantelor, reducând totodată riscul de condens și de boli favorizate de umezeală.",
    features: ["Pentru sere", "Reduce umiditatea", "Design slim și compact", "Nivel redus de zgomot"],
    // heroPos: "50% 30%", // opțional: ce parte din poza p4-hero se vede
    // youtube: { 4: "https://youtu.be/XXXXXXXXXXX" }, // slide video YouTube (nr = poziția în slideshow)

    advantages: [
      "Evacuează eficient aerul cald și reduce umiditatea din spațiile cu temperatură ridicată",
      "Accelerează transferul de căldură la evaporatoare și condensatoare",
      "Potrivit și pentru răcirea utilajelor industriale",
      "Design slim și compact, ocupă cu până la 50% mai puțin spațiu decât modelele echivalente",
      "Nivel redus de zgomot",
      "Corp și pale din tablă DKP de calitate, ambutisate la rece, cu vopsire electrostatică epoxy rezistentă la coroziune",
      "Pale și rotor echilibrate dinamic conform standardului ISO 1940, pentru o funcționare lină și o durată lungă a rulmenților",
      "Carcasă de motor din aluminiu cu aripioare, pentru disipare eficientă a căldurii",
      "Grilaj de protecție spate conform standardului EN 60335-2-80",
      "Izolație Clasa F și clasă de protecție IP54 (opțional IP55)",
      "Componente certificate, conforme cu standardele",
    ],

    specs: [
      { k: "Brand", v: "Dundar" },
      { k: "Material corp și pervane", v: "Tablă DKP (ambutisată la rece)" },
      { k: "Finisaj", v: "Vopsire electrostatică epoxy în pulbere" },
      { k: "Echilibrare pale și rotor", v: "Conform ISO 1940" },
      { k: "Grilaj de protecție", v: "Conform EN 60335-2-80" },
      { k: "Motor monofazat", v: "220-230 V / 50 Hz" },
      { k: "Motor trifazat (opțional)", v: "400 V / 50 Hz" },
      { k: "Izolație", v: "Clasa F" },
      { k: "Clasă de protecție", v: "IP54 (opțional IP55)" },
      { k: "Temperatură de lucru (motor)", v: "-20°C … +45°C" },
      { k: "Temperatură de lucru (bobine)", v: "-40°C … +70°C" },
      { k: "Control (fan trifazat)", v: "Compatibil cu invertor / control prin driver" },
    ],
    // flyer: "/flyere/produs4.pdf",
  },
  /* ============================================================
     PRODUSUL 5 - șablon gata de completat.
     Pune poza:  src/assets/produse/produs5.jpg
     Apoi înlocuiește textele de mai jos cu cele reale.
     - Dacă poza e pe fundal ALB (echipament, unealtă), lasă
       fit: "contain" ca să se vadă întreagă, fără crop.
     - Dacă e o poză „de ambianță" care trebuie să umple cardul,
       șterge linia fit: "contain".
     Orice câmp de care NU ai nevoie îl poți șterge - secțiunea
     aferentă din pagina de produs pur și simplu nu apare.
     ============================================================ */
  5: {
    name: "Ventilator pentru circulația aerului în sere",
    origin: { country: "China", code: "cn" },
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Ventilator profesional pentru sere, cu structură rezistentă și palete din aluminiu, conceput pentru circulația eficientă a aerului și menținerea unui climat uniform, favorabil dezvoltării plantelor.",
    // --- pagina de detalii ---
    intro: "Ventilator profesional pentru sere, cu structură rezistentă și palete din aluminiu, conceput pentru circulația eficientă a aerului. Menține aerul în mișcare și un climat uniform în toată sera, favorabil dezvoltării sănătoase a plantelor și reducerii zonelor cu aer stagnant.",
    features: ["Pentru sere", "Palete din aluminiu", "Structură rezistentă", "Circulație uniformă a aerului"],
    // heroFit: "contain", // dacă poza de hero (p5-hero) e pe fundal alb -> se vede întreagă
    // heroPos: "50% 30%", // opțional: ce parte din poza p5-hero se vede
    // sound: false,       // videoclipurile din slideshow rulează fără sunet
    // youtube: { 4: "https://youtu.be/XXXXXXXXXXX" }, // slide video YouTube (nr = poziția în slideshow)
    advantages: [
      "Asigură o circulație eficientă și uniformă a aerului în toată sera",
      "Menține un climat echilibrat, favorabil dezvoltării plantelor",
      "Reduce zonele cu aer stagnant și acumularea de umezeală",
      "Palete din aluminiu, ușoare și rezistente",
      "Structură robustă, pentru utilizare de durată",
    ],
    // Completează specificațiile când ai datele (putere motor, debit de aer,
    // diametru, alimentare, dimensiuni etc.) și scoate comentariul:
    // specs: [
    //   { k: "Putere motor", v: "-" },
    //   { k: "Debit de aer", v: "-" },
    //   { k: "Diametru", v: "-" },
    //   { k: "Alimentare", v: "220 V / 50 Hz" },
    // ],
    // flyer: "/flyere/produs5.pdf",
  },
  6: {
    name: "Tavă de irigare prin inundare și drenaj",
    origin: { country: "China", code: "cn" },
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Tavă de irigare Ebb & Flow pentru sere, concepută pentru inundarea și drenarea controlată a substratului, asigurând rădăcinilor un aport optim de apă, nutrienți și oxigen.",
    // --- pagina de detalii ---
    intro: "Vană din plastic pentru cultivarea plantelor prin metoda Ebb & Flow (inundare și drenaj). Mediul de cultură este inundat periodic, apoi apa se scurge complet înapoi în rezervor, astfel încât rădăcinile primesc un aport optim de apă și nutrienți și rămân bine oxigenate între cicluri. Poate fi folosită și ca tavă de drenaj sub ghivece.",
    features: ["Sistem Ebb & Flow", "Inundare și drenare controlată", "Din plastic", "0,91 × 1,82 m"],
    // heroFit: "contain", // dacă poza de hero (p6-hero) e pe fundal alb -> se vede întreagă
    // heroPos: "50% 30%", // opțional: ce parte din poza p6-hero se vede
    // sound: false,       // videoclipurile din slideshow rulează fără sunet
    // youtube: { 4: "https://youtu.be/XXXXXXXXXXX" }, // slide video YouTube (nr = poziția în slideshow)

    coverTitle: "Cum funcționează metoda Ebb & Flow?",
    coverText:
      "Ebb & Flow (inundare și drenaj) este o tehnică foarte eficientă, care oferă control maxim asupra sistemului radicular. Mediul de cultură este inundat periodic: la fiecare inundare se dizolvă reziduurile de nutrienți rămase de la udarea anterioară, așa că în substrat nu se formează depuneri și nu apare riscul de supra-fertilizare. Surplusul de apă, care depășește capacitatea de reținere a substratului, se scurge imediat prin orificii înapoi în rezervor. Dacă ciclul de udare este ales corect, practic nu există riscul de preaplin, iar rădăcinile au tot timpul suficienți nutrienți și oxigen.",

    advantages: [
      "Control maxim asupra sistemului radicular, prin inundare și drenare controlată",
      "Aport optim de apă și nutrienți direct la rădăcini, care rămân mereu bine oxigenate",
      "Dizolvă reziduurile de nutrienți de la udarea anterioară, fără depuneri și fără risc de supra-fertilizare",
      "Surplusul de apă se scurge imediat înapoi în rezervor, fără risc de băltire sau preaplin",
      "Soluția drenată se recirculă, reducând risipa de apă și de îngrășăminte",
      "Distribuție uniformă a apei pe toată suprafața tăvii",
      "Udare pe la bază, fără a uda frunzișul, ceea ce reduce riscul de boli",
      "Poate fi folosită și ca tavă de drenaj sub ghivece",
    ],

    specs: [
      { k: "Model", v: "Vană Ebb & Flow" },
      { k: "Material", v: "Plastic" },
      { k: "Dimensiuni (lățime × lungime)", v: "0,91 × 1,82 m (91 × 182 cm)" },
      { k: "Metodă", v: "Ebb & Flow (inundare și drenaj)" },
    ],
    // flyer: "/flyere/produs6.pdf",
  },
  7: {
    name: "Ladă hidroponică pentru creșterea bulbilor",
    origin: { country: "Netherlands", code: "nl" },
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Ladă stivuibilă pentru cultură hidroponică, cu compartimentări în bază și pini pentru fiecare bulb, astfel încât fiecare bulb are propriul spațiu pentru dezvoltarea rădăcinilor.",
    // --- pagina de detalii ---
    intro: "Ladă (crate) stivuibilă pentru cultură hidroponică, înaltă de 18 cm, potrivită atât pentru apă stătătoare, cât și pentru sisteme de tip «semi high & low tide» (maree semi-înaltă și joasă). Baza are compartimentări și câte patru pini rezistenți pentru fiecare bulb, astfel încât fiecare bulb are propriul spațiu pentru dezvoltarea rădăcinilor.",
    features: ["Stivuibilă", "Pentru cultură hidroponică", "Compartimentări în bază", "Pini pentru fiecare bulb"],
    heroFit: "contain", // poza de hero se vede ÎNTREAGĂ (nu zoomată)
    heroBg: "#141414",  // fundal închis pentru hero, să se contopească cu poza
    sound: false,       // videoclipurile din slideshow rulează fără sunet (fără buton de sunet)
    // heroPos: "50% 30%", // opțional: ce parte din poza p7-hero se vede
    // youtube: { 4: "https://youtu.be/XXXXXXXXXXX" }, // slide video YouTube (nr = poziția în slideshow)
    advantages: [
      "Patru pini rezistenți pentru fiecare bulb, astfel încât fiecare bulb are spațiul lui",
      "Compartimentări în bază, pentru dezvoltarea separată a rădăcinilor",
      "Stivuibilă, economisește spațiu",
      "Potrivită pentru apă stătătoare și pentru sisteme «semi high & low tide»",
      "Disponibilă și cu orificiu central, pentru o conductă de alimentare (feed-through pipe)",
      "Compatibilă cu bulbi de dimensiuni 9/10, 10/11, 11/12 și peste 12",
    ],
    specs: [
      { k: "Brand", v: "KPI" },
      { k: "Model", v: "NOVA crate (hydro)" },
      { k: "Dimensiuni (L × l)", v: "60 × 40 cm" },
      { k: "Înălțime", v: "18 cm" },
      { k: "Stivuibilă", v: "Da" },
      { k: "Sisteme compatibile", v: "Apă stătătoare / «semi high & low tide»" },
      { k: "Dimensiuni bulbi", v: "9/10, 10/11, 11/12 și peste 12" },
    ],
    // flyer: "/flyere/produs7.pdf",
  },
  8: {
    name: "Mașină de pulverizare pentru sere 10L",
    origin: { country: "Turkey", code: "tr" },
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Echipament ULV pentru sere, care pulverizează soluția în particule foarte fine, asigurând o dispersie uniformă și o combatere eficientă a dăunătorilor.",
    // --- pagina de detalii ---
    intro: "Aparat ULV portabil, cu motor electric de 2200 W, care pulverizează soluția sub formă de ceață rece, în particule foarte fine (20-50 microni). Cu o putere de două ori mai mare decât aparatele standard de 1000 W, produce picături mai mici și un debit mai mare. Particulele fine plutesc în aer și ajung peste tot, fiind eficiente atât în combaterea dăunătorilor, cât și în dezinfecția spațiilor.",
    features: ["Ceață rece (ULV)", "Dezinfecție și dezinsecție", "Rezervor 10 L", "Rază până la 50 m"],
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu zoomată)
    // heroBg: "#141414",  // fundal închis pentru hero (dacă poza are fundal închis)
    // heroPos: "50% 30%", // opțional: ce parte din poza p8-hero se vede
    // sound: false,       // videoclipurile din slideshow rulează fără sunet
    youtube: { 3: "https://youtu.be/0HU7JnehP_w" }, // slide video YouTube (nr = poziția în slideshow)
    coverTitle: "Ce este ceața rece (ULV)?",
    coverText:
      "Spre deosebire de aparatele cu ceață caldă (termică), care transformă soluția în vapori cu ajutorul căldurii, generatoarele cu ceață rece folosesc puterea aerului: soluția este spartă în particule foarte fine, care rămân suspendate în aer și ajung în toate colțurile încăperii. Pentru orientare, un fir de păr uman are circa 100 de microni, iar acest aparat produce picături între aproximativ 0,3 și 50 de microni, iar cu cât picăturile sunt mai fine, cu atât rămân mai mult timp în aer și au un contact mai bun cu ținta. Diametrul picăturilor poate fi reglat în funcție de debitul de soluție.",

    advantages: [
      "Produce ceață rece în particule foarte fine, de 20-50 microni, care plutesc în aer și ajung peste tot",
      "Motor electric de 2200 W, care nu emite CO₂ (spre deosebire de motoarele pe benzină), ideal pentru interior",
      "De 2× mai puternic decât aparatele standard de 1200 W, cu picături mai mici și debit mai mare",
      "Dezinfectează și sterilizează rapid suprafețe mari, până la 800 m² într-un minut",
      "Eficient în combaterea insectelor: țânțari, muște, lăcuste și alți dăunători (pest control / combatere vectorială)",
      "Potrivit și pentru dezinfecția spațiilor împotriva bolilor infecțioase",
      "Rezervor de 10 litri",
      "Portabil, de mână, ușor de utilizat",
      "Potrivit pentru numeroase spații: cafenele, restaurante, hoteluri, spitale și instituții medicale, birouri, depozite, ferme de animale și de păsări, adăposturi",
    ],
    specs: [
      { k: "Brand", v: "Duru" },
      { k: "Model", v: "MAX 10 (ULV)" },
      { k: "Tip", v: "Portabil, de mână" },
      { k: "Motor", v: "2200 W, 220 V AC / 50 Hz" },
      { k: "Capacitate rezervor", v: "10 litri" },
      { k: "Debit soluție", v: "0-49 l/h" },
      { k: "Diametru picătură", v: "0-49 microni" },
      { k: "Soluții compatibile", v: "SC, EC, WP" },
      { k: "Greutate", v: "6,7 kg" },
      { k: "Dimensiuni (l × L × Î)", v: "34 × 50 × 60 cm" },
    ],
    // flyer: "/flyere/produs8.pdf",
  },
  9: {
    name: "Găleată pătrată pentru transportul florilor",
    origin: { country: "China", code: "cn" },
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Găleată pătrată din polipropilenă virgină, de tipul celor folosite la licitațiile de flori din Olanda, pentru transportul și păstrarea florilor tăiate în apă.",
    // --- pagina de detalii ---
    intro: "Găleată (container) pătrată pentru transportul și depozitarea florilor tăiate, de tipul celor folosite la licitațiile de flori din Olanda. Este fabricată din polipropilenă virgină, are baza cu picioare, care o ridică de la sol, și pereți înalți de 38 cm, astfel încât florile stau drepte, în apă, pe tot drumul de la seră până la client. Este disponibilă în culoarea bej sau albă, iar varianta albă poate fi livrată și cu extensie, pentru flori cu tija mai lungă.",
    features: ["Pentru flori tăiate", "Polipropilenă virgină", "Extensie opțională", "40 × 33 × 38 cm"],
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p9-hero se vede
    // sound: false,       // videoclipurile din slideshow rulează fără sunet
    // youtube: { 4: "https://youtu.be/XXXXXXXXXXX" }, // slide video YouTube (nr = poziția în slideshow)
    advantages: [
      "Păstrează florile tăiate drepte și în apă pe toată durata transportului",
      "Format pătrat, de tipul celor folosite la licitațiile de flori din Olanda",
      "Din polipropilenă virgină, rezistentă și ușor de curățat",
      "Baza cu picioare ridică găleata de la sol și îi dă stabilitate",
      "Forma se îngustează spre partea de sus, astfel încât gălețile goale intră una în alta și ocupă mai puțin spațiu",
      "Potrivită pentru sere, depozite de flori, florării și comerț cu flori",
    ],
    specs: [
      { k: "Tip", v: "Găleată pătrată pentru flori (tip licitație)" },
      { k: "Material", v: "Polipropilenă virgină" },
      { k: "Culoare", v: "Bej / Alb" },
      { k: "Dimensiuni bază", v: "400 × 330 mm" },
      { k: "Dimensiuni sus", v: "345 × 260 mm" },
      { k: "Înălțime", v: "380 mm" },
      { k: "Extensie", v: "Opțională (varianta albă)" },
    ],
    // flyer: "/flyere/produs9.pdf",
  },
  10: {
    name: "Signum 33 WG – fungicid pentru protecția culturilor",
    // origin: { country: "Germany", code: "de" }, // completează țara de fabricație, dacă o știi
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Fungicid sistemic BASF pentru legume, căpșuni, arbuști fructiferi și pomi, împotriva putregaiului cenușiu, a alternariozei, a făinării și a manei.",
    // --- pagina de detalii ---
    intro: "Signum 33 WG este un fungicid produs de BASF, sub formă de granule care se dizolvă în apă (WG). Are acțiune sistemică, adică pătrunde în plantă și o protejează din interior, și poate fi folosit atât preventiv, înainte de apariția bolii, cât și curativ, la apariția primelor simptome. Combină două substanțe active cu moduri diferite de acțiune, piraclostrobina și boscalidul, și protejează o gamă largă de culturi: cartof, ceapă, varză, morcov, tomate (în câmp și în seră), căpșun, zmeur, coacăz negru și vișin. Se aplică prin stropire, cu echipamente autopropulsate sau tractate (pentru câmp și livadă), precum și cu pulverizatoare manuale.",
    features: ["Fungicid sistemic", "Preventiv și curativ", "Pentru câmp și seră", "Ambalaj 0,5 kg"],
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p10-hero se vede

    applicationsTitle: "Boli combătute",
    applicationsNoIcon: true, // fără romburile din fața fiecărui rând
    applications: [
      "Putregaiul cenușiu",
      "Alternarioza",
      "Mana",
      "Făinarea",
      "Pătarea neagră a cruciferelor",
      "Pătarea albă a frunzelor de căpșun",
      "Monilioza (putregaiul brun al sâmburoaselor)",
      "Antracnoza",
      "Rugina coacăzului",
      "Uscarea lăstarilor de zmeur",
    ],

    advantages: [
      "Acțiune sistemică, pătrunde în plantă și o protejează din interior",
      "Se poate folosi preventiv, înainte de apariția bolii, dar și curativ, la primele simptome",
      "Două substanțe active din grupe diferite (strobilurine și anilide), pentru o protecție mai completă",
      "Combate mai multe boli importante cu un singur produs, de la putregaiul cenușiu la alternarioză și mană",
      "Potrivit atât pentru culturile din câmp, cât și pentru tomatele cultivate în seră",
      "Formulare sub formă de granule dispersabile în apă, ușor de dozat și de preparat",
      "Compatibil cu echipamente de stropit pentru câmp și livadă, precum și cu pulverizatoare manuale",
    ],

    usage: [
      { cultura: "Cartof", boli: "Alternarioza", doza: "0,25 kg/ha", apa: "200–400 l/ha", tratamente: "4", interval: "min. 10 zile" },
      { cultura: "Ceapă", boli: "Mana, alternarioza; limitează Stemphylium", doza: "1 kg/ha", apa: "600–800 l/ha", tratamente: "3", interval: "min. 7 zile" },
      { cultura: "Varză albă", boli: "Pătarea neagră a cruciferelor, putregaiul cenușiu", doza: "0,75–1 kg/ha", apa: "600–800 l/ha", tratamente: "3", interval: "min. 7 zile" },
      { cultura: "Morcov", boli: "Alternarioza frunzelor, făinarea", doza: "0,75–1 kg/ha", apa: "600–800 l/ha", tratamente: "2", interval: "min. 7 zile" },
      { cultura: "Tomate în câmp", boli: "Mana, alternarioza", doza: "1–1,5 kg/ha", apa: "600–800 l/ha", tratamente: "3", interval: "min. 7 zile" },
      { cultura: "Tomate în seră", boli: "Putregaiul cenușiu, mana", doza: "0,2% (200 g la 100 l apă)", apa: "100 l / 1000 m²", tratamente: "2", interval: "min. 7 zile" },
      { cultura: "Căpșun", boli: "Putregaiul cenușiu, pătarea albă a frunzelor, făinarea", doza: "1,8 kg/ha", apa: "500–700 l/ha", tratamente: "2", interval: "min. 5 zile" },
      { cultura: "Vișin", boli: "Monilioza (putregaiul brun)", doza: "0,75–1 kg/ha", apa: "500–750 l/ha", tratamente: "2", interval: "min. 5 zile" },
      { cultura: "Zmeur", boli: "Putregaiul cenușiu, uscarea lăstarilor", doza: "1,8 kg/ha", apa: "600–700 l/ha", tratamente: "2", interval: "min. 7 zile" },
      { cultura: "Coacăz negru", boli: "Antracnoza, rugina", doza: "1,8 kg/ha", tratamente: "2", interval: "7–10 zile" },
    ],
    usageNote: "Valorile sunt preluate din eticheta produsului. Se recomandă stropirea cu picături fine, iar la pericol mare de boală se folosește doza mai mare. Eticheta mai include și culturi minore, precum sfeclă roșie, țelină, pătrunjel, praz, salată, spinac, ardei și vinete în seră, plante ornamentale și aromatice, cireș, cais, piersic, prun, afin, alun și nuc. Înainte de utilizare, citiți eticheta și respectați reglementările în vigoare.",

    specs: [
      { k: "Brand", v: "BASF" },
      { k: "Denumire", v: "Signum 33 WG" },
      { k: "Tip", v: "Fungicid sistemic" },
      { k: "Formulare", v: "WG – granule dispersabile în apă" },
      { k: "Substanțe active", v: "Piraclostrobină 67 g/kg (6,7%), boscalid 267 g/kg (26,7%)" },
      { k: "Acțiune", v: "Preventivă și curativă" },
      { k: "Ambalaj", v: "0,5 kg" },
      { k: "Mod de aplicare", v: "Stropire (pulverizare cu picături fine)" },
      { k: "Cod EAN", v: "4014348972925" },
    ],
    // flyer: "/flyere/produs10.pdf",
  },
  11: {
    name: "Mospilan 20 SP – insecticid pentru protecția culturilor",
    // origin: { country: "Japan", code: "jp" }, // completează țara de fabricație, dacă o știi
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Insecticid cu acetamiprid original japonez, împotriva afidelor, a musculiței albe, a tripșilor, a gândacului din Colorado și a altor dăunători.",
    // --- pagina de detalii ---
    intro: "Mospilan 20 SP este un insecticid care conține acetamiprid original japonez, într-o formulare SP verificată (pulbere solubilă în apă). Acționează prin contact și prin ingestie împotriva dăunătorilor care sug sau rod plantele, iar în plantă se deplasează la suprafață, în profunzimea frunzei și sistemic. Are o acțiune eficientă și de durată și nu are nevoie de adjuvanți. Este recomandat și pentru flori și plante ornamentale, în câmp și în seră, unde combate musculița albă, tripșii, afidele și minierii. Protejează de asemenea pomii și arbuștii fructiferi, legumele din câmp și din seră, cartoful și rapița. Se aplică prin stropire, cu echipamente autopropulsate sau tractate (pentru câmp și livadă), precum și cu pulverizatoare manuale.",
    features: ["Insecticid sistemic", "Pentru flori și plante ornamentale", "Pentru câmp și seră", "Fără adjuvanți"],
    heroFit: "contain", // poza de hero se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p11-hero se vede

    applicationsTitle: "Dăunători combătuți",
    applicationsNoIcon: true, // fără romburile din fața fiecărui rând
    applications: [
      "Afidele (păduchii de frunze)",
      "Musculița albă de seră",
      "Tripșii",
      "Gândacul din Colorado",
      "Viermele merelor și al prunelor",
      "Musca cireșelor",
      "Psila părului",
      "Moliile frunzelor și omizile tinere",
      "Gândacul lucios al rapiței",
      "Gărgărițele florilor",
      "Puricii de pământ",
      "Musculițele minierilor",
    ],

    advantages: [
      "Conține acetamiprid original japonez, într-o formulare SP verificată",
      "Acțiune eficientă și de durată, pentru o protecție sigură a culturilor",
      "Funcționează fără adjuvanți (substanțe auxiliare)",
      "Acționează prin contact și prin ingestie, împotriva dăunătorilor care sug sau rod plantele",
      "Se deplasează în plantă la suprafață, în profunzimea frunzei și sistemic",
      "Combate un număr mare de dăunători, de la afide și tripși la gândacul din Colorado",
      "Protejează florile și plantele ornamentale în câmp și în seră: 4 g la 10 l apă, aplicat la apariția dăunătorului",
      "Potrivit și pentru pomi și arbuști fructiferi, legume, cartof și rapiță",
      "Ambalaje mici, de 40 g și 80 g, potrivite pentru grădini, livezi mici și sere",
    ],

    usageTargetLabel: "Dăunători combătuți",
    usage: [
      { cultura: "Flori și plante ornamentale (în câmp și în seră)", boli: "Musculița albă de seră, tripșii (inclusiv tripsul californian), minierii, afidele, coșenilele, ploșnițele, molia cimișirului", doza: "0,04% (4 g la 10 l apă)", perioada: "La apariția dăunătorului, indiferent de faza de dezvoltare a plantelor" },
      { cultura: "Măr", boli: "Afide, păduchele lânos, viermele merelor, viespea merelor, molia minieră, musculița frunzelor", doza: "0,125–0,2 kg/ha", perioada: "La apariția dăunătorului, de la butonul verde până după înflorire, în funcție de dăunător" },
      { cultura: "Păr", boli: "Afide, psila părului, viermele merelor, moliile frunzelor, gărgărița florilor", doza: "0,125–0,2 kg/ha", perioada: "La apariția primelor colonii sau la începutul zborului fluturilor" },
      { cultura: "Cireș și vișin", boli: "Musca cireșelor, afide, moliile frunzelor, gărgărița florilor", doza: "0,125–0,2 kg/ha", perioada: "La zborul intens al muștelor și la depunerea ouălor; la afide, la primele colonii" },
      { cultura: "Prun", boli: "Afide, viespea prunelor, viermele prunelor, păduchele țestos, moliile frunzelor", doza: "0,125–0,2 kg/ha", perioada: "La apariția dăunătorului; la viermele prunelor, la fiecare generație" },
      { cultura: "Piersic și cais", boli: "Afide, moliile frunzelor și omizile tinere", doza: "0,2 kg/ha", perioada: "De la prima frunză până la maturarea fructelor, cu respectarea pauzei până la recoltare" },
      { cultura: "Zmeur", boli: "Afide, moliile frunzelor, gărgărița florilor, musculița lăstarilor", doza: "0,2 kg/ha", perioada: "De la prima frunză până la înflorire, sau după recoltare" },
      { cultura: "Căpșun", boli: "Gărgărița florilor; gărgărițele rădăcinilor", doza: "0,2 kg/ha; 0,3 kg/ha", perioada: "Înainte de înflorire; gărgărițele rădăcinilor, după recoltare" },
      { cultura: "Cartof", boli: "Gândacul din Colorado (larve și adulți)", doza: "0,08–0,12 kg/ha", perioada: "La depunerea ouălor și la ieșirea în masă a larvelor" },
      { cultura: "Rapiță de toamnă", boli: "Gândacul lucios, gărgărițele tulpinii și ale semințelor, musculița păstăilor", doza: "0,08–0,25 kg/ha", perioada: "De la creșterea tulpinii până la căderea petalelor, în funcție de dăunător" },
      { cultura: "Varză", boli: "Puricii de pământ, gărgărițele, tripșii", doza: "0,2 kg/ha", perioada: "La apariția dăunătorului, de la 3 frunze până la formarea căpățânii" },
      { cultura: "Castravete", boli: "Tripșii, musca semințelor, ploșnițele", doza: "0,2 kg/ha", perioada: "La apariția dăunătorului, de la prima frunză" },
      { cultura: "Mazăre, fasole și bob", boli: "Gărgărițele boabelor, tripșii, musca semințelor", doza: "0,2 kg/ha", perioada: "La apariția dăunătorului, în funcție de dăunător" },
      { cultura: "Praz", boli: "Tripșii, gărgărița prazului, molia prazului, musca semințelor", doza: "0,2 kg/ha", perioada: "La apariția dăunătorului, de la prima frunză" },
      { cultura: "Tomate și vinete în seră", boli: "Musculița albă de seră, tripșii, minierii, afidele, ploșnițele, puricii", doza: "0,04% (4 g la 10 l apă)", perioada: "La apariția dăunătorului, indiferent de faza de dezvoltare" },
    ],
    usageNote: "Valorile sunt preluate din eticheta produsului. Doza exactă depinde de dăunător: unde este un interval, valoarea mai mare se folosește la presiune mare a dăunătorului. Eticheta mai include și sfecla, tutunul, nucul, salcia și culturile silvice. Înainte de utilizare, citiți eticheta și respectați reglementările în vigoare.",

    specs: [
      { k: "Brand", v: "Mospilan (Sumi Agro)" },
      { k: "Denumire", v: "Mospilan 20 SP" },
      { k: "Tip", v: "Insecticid sistemic" },
      { k: "Formulare", v: "SP – pulbere solubilă în apă" },
      { k: "Substanță activă", v: "Acetamiprid 20% (grupa neonicotinoidelor)" },
      { k: "Mod de acțiune", v: "Contact și ingestie; de suprafață, translaminar și sistemic" },
      { k: "Ambalaje disponibile", v: "40 g și 80 g" },
      { k: "Suprafață tratată (la doza de 0,2 kg/ha)", v: "40 g ≈ 20 ari (2.000 m²); 80 g ≈ 40 ari (4.000 m²)" },
      { k: "Soluție pentru flori și seră (concentrație 0,04%)", v: "40 g ≈ 100 l soluție; 80 g ≈ 200 l soluție" },
      { k: "Mod de aplicare", v: "Stropire (pulverizare)" },
    ],
    // flyer: "/flyere/produs11.pdf",
  },
  12: {
    name: "FloraLife Quick Dip – hidratare instantanee pentru flori tăiate",
    // origin: { country: "Netherlands", code: "nl" }, // completează țara de fabricație, dacă o știi
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Soluție gata de utilizare pentru hidratarea rapidă a florilor tăiate. Câteva secunde de imersie a tijei ajung pentru flori proaspete și viguroase.",
    // --- pagina de detalii ---
    intro: "FloraLife Quick Dip este o soluție gata de utilizare care ajută florile tăiate să absoarbă mai repede apa și oferă un impuls rapid de hidratare. O imersie scurtă a tijei, de 1–3 secunde, este suficientă pentru ca florile să absoarbă la maximum apa și nutrienții. Ajută la reducerea îndoirii florii sub boboc (bent neck) și a tijelor ofilite, iar florile rămân proaspete și pline de viață. Se poate folosi pentru toate tipurile de flori și frunziș decorativ, inclusiv pentru buchetele gata făcute.",
    features: ["Gata de utilizare", "Imersie de doar 1–3 secunde", "Pentru toate florile tăiate", "Reduce pierderile"],
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p12-hero se vede

    advantages: [
      "O imersie scurtă a tijei este suficientă, iar floarea absoarbe la maximum apa și nutrienții",
      "Hidratare instantanee, care menține florile tăiate proaspete și viguroase și le readuce prospețimea",
      "Soluție gata de utilizare, fără nevoie de diluare sau amestecare",
      "Ajută la reducerea pierderilor de flori",
      "Reduce îndoirea florii sub boboc și ofilirea tijelor",
      "Indispensabil pentru trandafiri, gerbera și florile cultivate în câmp",
      "Se poate folosi pentru toate soiurile de flori, inclusiv pentru buchetele gata făcute",
      "Pregătire ideală înaintea soluțiilor FloraLife pentru depozitare, transport și hrănirea florilor",
    ],
    advantagesNote: "Potrivit pentru cultivatori, florării, depozite și angrosiști de flori, transportatori, supermarketuri, organizatori de evenimente și pentru cei care fac buchete.",

    stepsTitle: "Mod de utilizare",
    steps: [
      "Turnați 5–6 cm de soluție într-un recipient curat. Produsul este gata de utilizare și nu trebuie diluat.",
      "Îndepărtați frunzele de pe partea tijei care va sta sub nivelul apei în vază sau în găleată, apoi tăiați 3 cm de la baza tijei cu un cuțit sau o foarfecă curată.",
      "Introduceți tijele în soluția FloraLife Quick Dip pentru aproximativ 1–3 secunde.",
    ],
    stepsAfter: [
      "Puneți imediat florile în apă cu soluție nutritivă FloraLife pentru flori tăiate.",
      "Schimbați soluția folosită zilnic sau mai devreme, dacă devine tulbure sau murdară.",
      "Nu turnați niciodată soluția folosită înapoi în sticla originală.",
    ],

    specs: [
      { k: "Brand", v: "FloraLife" },
      { k: "Denumire", v: "Quick Dip (cunoscut anterior ca Quick Dip 100)" },
      { k: "Categorie", v: "Hidratare (Hydrate)" },
      { k: "Utilizare", v: "Toate tipurile de flori tăiate și frunziș decorativ" },
      { k: "Dozare", v: "Gata de utilizare, fără diluare" },
      { k: "Timp de imersie", v: "1–3 secunde" },
      { k: "Ambalaj", v: "1 L" },
      { k: "Sticlă", v: "Din plastic 100% reciclat" },
    ],
    // flyer: "/flyere/produs12.pdf",
  },
  13: {
    name: "Topsin M 500 SC – fungicid pentru flori, legume și pomi",
    // origin: { country: "Japan", code: "jp" }, // completează țara de fabricație, dacă o știi
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Fungicid sistemic cu tiofanat-metil, pentru flori și plante ornamentale, legume în câmp și în seră, pomi, viță-de-vie și arbuști fructiferi.",
    // --- pagina de detalii ---
    intro: "Topsin M 500 SC este un fungicid cu acțiune sistemică, sub formă de suspensie concentrată, care se diluează cu apă. Se folosește preventiv, curativ și pentru eradicarea bolilor, în protecția florilor și a plantelor ornamentale, a legumelor și a pomilor fructiferi împotriva bolilor produse de ciuperci. La flori și plante ornamentale combate fuzarioza garoafelor, pătările frunzelor, ale florilor și ale lăstarilor, precum și cancerul lăstarilor la thuja, chiparoși, ienuperi și alți arbuști ornamentali, atât în câmp, cât și în seră. Conține 500 g/l tiofanat-metil și se aplică prin stropire, cu pulverizatoare manuale.",
    features: ["Fungicid sistemic", "Pentru flori și plante ornamentale", "Pentru grădină și seră", "Flacon 1 L"],
    heroFit: "contain", // poza de hero se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p13-hero se vede

    applicationsTitle: "Boli combătute",
    applicationsNoIcon: true, // fără romburile din fața fiecărui rând
    applications: [
      "Fuzarioza garoafelor",
      "Pătările frunzelor, florilor și lăstarilor",
      "Cancerul lăstarilor și al ramurilor",
      "Putregaiul cenușiu",
      "Putregaiul alb (sclerotinioza)",
      "Făinarea",
      "Monilioza",
      "Ciuruirea frunzelor sâmburoaselor",
      "Antracnoza",
      "Alternarioza",
      "Septorioza",
      "Fuzarioza",
    ],

    advantages: [
      "Acțiune sistemică, pătrunde în plantă și o protejează din interior",
      "Se folosește preventiv, curativ și pentru eradicarea bolii",
      "Recomandat pentru flori și plante ornamentale, în câmp și în seră: garoafe, balsamine, thuja, chiparoși, ienuperi și alți arbuști",
      "Combate un număr mare de boli produse de ciuperci, de la putregaiul cenușiu la făinare și monilioză",
      "Potrivit pentru legume în câmp și în seră, pomi fructiferi, viță-de-vie și arbuști fructiferi",
      "Suspensie concentrată, ușor de dozat și de diluat în apă",
      "Flacon de 1 L, care ajunge pentru o suprafață mare (de exemplu, aproximativ 6.600 m² la 15 ml/100 m²)",
    ],

    usageTargetLabel: "Boli combătute",
    usage: [
      { cultura: "Garoafe (în seră)", boli: "Fuzarioza vasculară", doza: "0,1% (1 ml la 1 l apă)", apa: "5–10 l/100 m²", tratamente: "2", interval: "7–14 zile", pauza: "Nu este cazul" },
      { cultura: "Balsamine (în seră)", boli: "Pătarea inelară", doza: "0,1% (1 ml la 1 l apă)", apa: "5–10 l/100 m²", tratamente: "1", pauza: "Nu este cazul" },
      { cultura: "Thuja, chiparoși, ienuperi și alți arbuști ornamentali", boli: "Pătarea inelară a lăstarilor, pătările frunzelor și florilor, cancerul lăstarilor", doza: "Seră: 0,15% (15 ml la 10 l apă); câmp: 15 ml/100 m²", apa: "Seră: 3–10 l/100 m²; câmp: 4–7,5 l/100 m²", perioada: "La apariția simptomelor sau preventiv, primăvara, când temperatura ajunge la circa 20°C", tratamente: "1", pauza: "Nu este cazul" },
      { cultura: "Măr", boli: "Cancerul ramurilor, cancerul scoarței, putregaiul amar", doza: "15 ml/100 m²", apa: "5–7,5 l/100 m²", perioada: "Primăvara, imediat după tăieri sau după grindină; la putregaiul amar, cu 2 săptămâni înainte de recoltare", tratamente: "1", pauza: "14 zile" },
      { cultura: "Păr", boli: "Cancerul ramurilor, cancerul scoarței, putregaiul amar, monilioza", doza: "15 ml/100 m²", apa: "5–9 l/100 m²", perioada: "Imediat după tăieri sau după grindină; de la înflorire până la colorarea fructelor", tratamente: "1", pauza: "14 zile" },
      { cultura: "Prun, vișin, cireș, piersic și cais", boli: "Monilioza, ciuruirea frunzelor, cilindrosporioza, citosporoza; la piersic și făinarea", doza: "15 ml/100 m²", apa: "5–9 l/100 m²", perioada: "De la înflorire până la colorarea fructelor; la piersic și cais, și după tăieri sau grindină", tratamente: "1", pauza: "14 zile" },
      { cultura: "Viță-de-vie", boli: "Putregaiul cenușiu, făinarea", doza: "15 ml/100 m²", apa: "5–9 l/100 m²", perioada: "La primele simptome, de la înflorire până la începutul coacerii boabelor", tratamente: "1", pauza: "35 zile" },
      { cultura: "Coacăz și agriș", boli: "Făinarea americană, pătarea albă a frunzelor, antracnoza, putregaiul cenușiu", doza: "15 ml/100 m²", apa: "5–9 l/100 m²", perioada: "De la apariția bobocilor până la sfârșitul înfloririi și după recoltare", tratamente: "1", pauza: "14 zile" },
      { cultura: "Căpșun", boli: "Făinarea, pătarea albă a frunzelor, putregaiul cenușiu", doza: "15 ml/100 m²", apa: "5–9 l/100 m²", perioada: "De la apariția bobocilor până la înflorirea deplină și după recoltare", tratamente: "1", pauza: "14 zile" },
      { cultura: "Zmeur, mur și afin", boli: "Uscarea lăstarilor, putregaiul cenușiu; la afin și antracnoza", doza: "15 ml/100 m²", apa: "5–9 l/100 m²", perioada: "De la apariția bobocilor până la sfârșitul înfloririi", tratamente: "1", pauza: "14 zile" },
      { cultura: "Castravete (în seră)", boli: "Antracnoza, putregaiul alb, cladosporioza (pătarea brună)", doza: "0,15% (1,5 ml la 1 l apă)", apa: "12–15 l/100 m²", perioada: "De la începutul înfloririi", tratamente: "3", interval: "7–10 zile", pauza: "3 zile" },
      { cultura: "Tomate (în seră)", boli: "Pătarea brună a frunzelor, putregaiul alb, putregaiul cenușiu, făinarea, alternarioza, septorioza", doza: "0,15% (1,5 ml la 1 l apă)", apa: "12–15 l/100 m²", perioada: "De la formarea fructelor", tratamente: "3", interval: "7–10 zile", pauza: "3 zile" },
      { cultura: "Ardei, dovlecel și vinete (în seră)", boli: "Verticilioza, putregaiul cenușiu, alternarioza, putregaiul alb, antracnoza", doza: "0,15% (1,5 ml la 1 l apă)", apa: "12–15 l/100 m²", perioada: "La primele simptome, de la înflorire până la maturarea fructelor", tratamente: "1", pauza: "3 zile" },
      { cultura: "Varză", boli: "Pătarea neagră a cruciferelor, putregaiul alb, putregaiul cenușiu", doza: "10 ml/100 m²", apa: "3–7 l/100 m²", perioada: "De la formarea căpățânii", tratamente: "1", pauza: "3 zile" },
      { cultura: "Ceapă și usturoi", boli: "Putregaiul cenușiu al gâtului, fuzarioza, alternarioza", doza: "15 ml/100 m²", apa: "3–7 l/100 m²", perioada: "De la a treia frunză", tratamente: "1", pauza: "14 zile" },
      { cultura: "Morcov, pătrunjel și păstârnac", boli: "Alternarioza, făinarea, putregaiul alb; la morcov și putregaiul cenușiu", doza: "12 ml/100 m²", apa: "6–8 l/100 m²", perioada: "De la a treia frunză până la formarea rădăcinii", tratamente: "1", pauza: "28 zile" },
      { cultura: "Țelină", boli: "Septorioza, cercosporioza, putregaiul alb, putregaiul cenușiu", doza: "12 ml/100 m²", apa: "6–8 l/100 m²", perioada: "De la a treia frunză până la formarea rădăcinii", tratamente: "1", pauza: "14 zile" },
      { cultura: "Sfeclă roșie", boli: "Cercosporioza, făinarea, rugina, pătarea brună a frunzelor", doza: "12 ml/100 m²", apa: "3,5–5 l/100 m²", perioada: "Când frunzele acoperă jumătate din sol, până la formarea rădăcinii", tratamente: "1", pauza: "14 zile" },
      { cultura: "Mazăre și bob", boli: "Antracnoza, fuzarioza; la bob și putregaiul cenușiu, putregaiul alb, pătarea ciocolatie, rugina", doza: "15 ml/100 m²", perioada: "De la apariția bobocilor până la sfârșitul înfloririi", tratamente: "1", pauza: "14 zile" },
    ],
    usageNote: "Valorile sunt preluate din eticheta produsului, iar „Nr. max. tratamente” înseamnă numărul maxim de tratamente pe sezon. Înainte de prima utilizare pe un soi nou de flori sau de legume, faceți un tratament de probă și urmăriți plantele 7 zile. Pentru a evita apariția rezistenței, dacă e nevoie de un nou tratament, folosiți un produs dintr-o altă grupă chimică. Înainte de utilizare, citiți eticheta și respectați reglementările în vigoare.",

    stepsTitle: "Prepararea soluției și măsuri de siguranță",
    steps: [
      "Stabiliți exact cantitatea de soluție de care aveți nevoie și agitați puternic flaconul înainte de utilizare.",
      "Turnați cantitatea măsurată de produs în rezervorul pulverizatorului umplut parțial cu apă, completați cu apă până la cantitatea necesară și amestecați.",
      "Clătiți de trei ori flaconul gol cu apă, turnați apa de clătire în rezervor, iar după lucru spălați bine pulverizatorul.",
    ],
    stepsAfter: [
      "Purtați mănuși și îmbrăcăminte de protecție, iar în seră și mască de protecție respiratorie de tip P2. Evitați inhalarea ceței.",
      "Nu intrați pe suprafața tratată până când soluția nu s-a uscat complet pe plante.",
      "Aplicați în afara perioadei de activitate a albinelor și a altor insecte polenizatoare și nu poluați apele.",
      "Păstrați produsul în ambalajul original, închis, departe de copii și de alimente, la o temperatură între 0 și 30°C.",
    ],

    specs: [
      { k: "Denumire", v: "Topsin M 500 SC" },
      { k: "Tip", v: "Fungicid sistemic" },
      { k: "Formulare", v: "SC – suspensie concentrată, se diluează cu apă" },
      { k: "Substanță activă", v: "Tiofanat-metil 500 g/l (41,91%), grupa benzimidazolilor" },
      { k: "Acțiune", v: "Preventivă, curativă și de eradicare" },
      { k: "Ambalaj", v: "1 L" },
      { k: "Câtă soluție se obține din 1 L", v: "La 0,1%: circa 1.000 l; la 0,15%: circa 660 l" },
      { k: "Suprafață tratată cu 1 L (la 15 ml/100 m²)", v: "Circa 6.600 m²" },
      { k: "Mod de aplicare", v: "Stropire cu pulverizatoare manuale" },
      { k: "Valabilitate", v: "2 ani" },
    ],
    // flyer: "/flyere/produs13.pdf",
  },
  14: {
    name: "Bisteran – stimulator de creștere și regenerare a plantelor",
    // origin: { country: "Poland", code: "pl" }, // completează țara de fabricație, dacă o știi
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Regulator de creștere pe bază de peroxid de hidrogen, care ajută plantele să se refacă după stres, protejează rănile de infecții și stimulează creșterea răsadurilor.",
    // --- pagina de detalii ---
    intro: "Bisteran este un regulator de creștere pe bază de peroxid de hidrogen (35–50%). Folosit după factori de stres, protejează rănile plantelor de infecții și sistemul radicular de putrezire, grăbește vindecarea rănilor și regenerarea plantelor și le crește rezistența la stres. Se folosește pentru tratarea tuberculilor de cartof înainte de plantare și înainte de depozitare, pentru dezinfectarea semințelor, pentru stimularea creșterii răsadurilor și pentru reducerea bolilor în câmp. Poate fi folosit la multe legume în câmp și în seră, în livezi, la arbuști fructiferi, la plante ornamentale și în pepiniere.",
    features: ["Regulator de creștere", "Regenerare după stres", "Pentru răsaduri și semințe", "Ambalaj 1 kg"],
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p14-hero se vede

    advantages: [
      "Ajută plantele să se refacă rapid după factori de stres",
      "Protejează rănile de infecții și sistemul radicular de putrezire",
      "Grăbește vindecarea rănilor și regenerarea plantelor",
      "Crește rezistența plantelor la factorii de stres",
      "Stimulează creșterea răsadurilor și îmbunătățește calitatea lor",
      "Dezinfectează semințele netratate înainte de semănat",
      "Reduce bolile din depozit la cartof, prin vindecarea rapidă a rănilor tuberculilor",
      "Se poate folosi la legume în câmp și în seră, în livezi, la arbuști fructiferi, la plante ornamentale și în pepiniere",
    ],

    usageTargetLabel: "Scopul tratamentului",
    usage: [
      { cultura: "Toate culturile, după factori de stres", boli: "Protejează rănile de infecții și rădăcinile de putrezire, grăbește regenerarea", doza: "0,2% (200 ml la 100 l apă), apoi 0,1% (100 ml la 100 l apă)", perioada: "Imediat după stres; se repetă după 2–3 zile cu 0,1%, apoi după încă 5 zile cu 0,1%" },
      { cultura: "Plante rănite", boli: "Protejarea rănilor", doza: "Maximum 0,05% (50 ml la 100 l apă)", perioada: "O singură aplicare" },
      { cultura: "Cartof – tuberculi înainte de plantare", boli: "Tratarea tuberculilor", doza: "0,3–0,5% (300–500 ml la 100 l apă)", perioada: "Înainte de plantare, prin pulverizarea atentă a tuberculilor sau prin imersie" },
      { cultura: "Cartof – în câmp", boli: "Reducerea bolilor", doza: "0,05–0,1% (50–100 ml la 100 l apă); 0,5–1 l/ha la 500–1000 l apă", perioada: "De la închiderea rândurilor" },
      { cultura: "Cartof – înainte de depozitare", boli: "Vindecarea rapidă a rănilor, reducerea bolilor din depozit", doza: "0,3–0,5% (300–500 ml la 100 l apă)", perioada: "După recoltare, prin pulverizare fină pe tuberculi" },
      { cultura: "Varză, conopidă, broccoli – semințe", boli: "Dezinfectarea semințelor netratate", doza: "0,3% (300 ml la 100 l apă)", perioada: "Înainte de semănat, prin înmuiere timp de 1 minut" },
      { cultura: "Varză, conopidă, broccoli – răsaduri", boli: "Stimularea creșterii și calitatea răsadurilor", doza: "0,05–0,1% (50–100 ml la 100 l apă)", perioada: "În perioada de producere a răsadurilor" },
      { cultura: "Varză, conopidă, broccoli – după plantare", boli: "Stimularea creșterii, reducerea bolilor", doza: "0,5–1 l/ha la 500–1000 l apă", perioada: "După plantarea în câmp" },
      { cultura: "Varză, conopidă, broccoli – înainte de recoltare", boli: "Reducerea putregaiului", doza: "0,1–0,2% (100–200 ml la 100 l apă) sau 0,5 l/ha la 500–1000 l apă", perioada: "Cu 2–3 săptămâni înainte de recoltare" },
    ],
    usageNote: "Doza generală pentru stropire este de 0,05–0,2% (50–200 ml la 100 l apă), adică 0,5–2 l de produs pe hectar, la 500–1000 l apă. La varză se încadrează și varza chinezească și varza creață. Produsul concentrat este un oxidant puternic: lucrați cu mănuși și ochelari de protecție. Înainte de utilizare, citiți eticheta și respectați reglementările în vigoare.",

    specs: [
      { k: "Denumire", v: "Bisteran" },
      { k: "Tip", v: "Regulator de creștere" },
      { k: "Compoziție", v: "Peroxid de hidrogen 35–50%" },
      { k: "Culturi", v: "Cartof, varză albă, varză chinezească, varză creață, conopidă, broccoli; de asemenea legume, pomi, arbuști fructiferi, plante ornamentale, pepiniere" },
      { k: "Concentrație de stropire", v: "0,05–0,2% (50–200 ml la 100 l apă)" },
      { k: "Doză la hectar", v: "0,5–2 l/ha, la 500–1000 l apă" },
      { k: "Ambalaj", v: "1 kg" },
    ],
    // flyer: "/flyere/produs14.pdf",
  },
  15: {
    name: "Superam 10 AL plus – adjuvant pentru tratamentele de protecție",
    origin: { country: "Poland", code: "pl" },
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Adjuvant lichid care se adaugă în soluția de stropit, pentru o acoperire mai bună a plantelor, o eficiență mai mare a tratamentelor și mai puțină spumă.",
    // --- pagina de detalii ---
    intro: "Superam 10 AL plus este un preparat lichid specializat (adjuvant), care se adaugă în soluția de stropit împreună cu produsele de protecție a plantelor. Le crește eficiența și durata de acțiune și reduce formarea spumei la prepararea soluției. Îmbunătățește acoperirea plantelor, depunerea și absorbția produselor de protecție și conține un agent antispumant modern și un agent adeziv. Este deosebit de util la plantele greu de umezit, acoperite cu un strat de ceară, precum varza, garoafele sau trandafirii. Se folosește în culturile agricole, silvice, pomicole, legumicole, la plantele ornamentale și în sere.",
    features: ["Adjuvant cu agent adeziv", "Acoperire mai bună", "Reduce spuma", "Flacon 1 L"],
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p15-hero se vede

    advantages: [
      "Crește eficiența și durata de acțiune a produselor de protecție a plantelor",
      "Distribuie mai bine soluția pe plante",
      "Mărește suprafața acoperită, mai ales la plantele greu de umezit, cu strat de ceară, precum varza, garoafele sau trandafirii",
      "Îmbunătățește depunerea și absorbția produselor de protecție",
      "Ajută la combaterea dăunătorilor greu de atins: afide pe plantele cu frunze, dăunători acoperiți cu ceară sau care formează pânze (de exemplu, păianjenii)",
      "Reduce formarea spumei la prepararea soluției, datorită agentului antispumant modern",
      "Fără pauză până la recoltare și fără perioadă de prevenție",
      "Potrivit pentru culturi agricole, silvice, pomicole, legumicole, plante ornamentale și culturi în seră",
    ],

    stepsTitle: "Mod de utilizare și măsuri de siguranță",
    steps: [
      "Pregătiți soluția de stropit conform recomandărilor produsului de protecție la care adăugați Superam 10 AL plus.",
      "Adăugați Superam 10 AL plus în soluție, amestecați și stropiți plantele.",
    ],
    stepsAfter: [
      "Produsul este coroziv pentru piele și poate provoca leziuni grave ale ochilor: purtați mănuși, îmbrăcăminte de protecție și ochelari sau mască de protecție a feței.",
      "În caz de contact cu pielea, scoateți imediat hainele contaminate și clătiți pielea cu apă. În caz de contact cu ochii, clătiți cu grijă cu apă câteva minute.",
      "Este nociv pentru organismele acvatice: nu poluați apele și strângeți produsul vărsat.",
      "Păstrați produsul departe de copii, în ambalajul original, bine închis, la o temperatură între 5 și 25°C.",
    ],

    specs: [
      { k: "Producător", v: "Danmar (Polonia)" },
      { k: "Denumire", v: "Superam 10 AL plus" },
      { k: "Tip", v: "Adjuvant (preparat auxiliar pentru soluțiile de stropit)" },
      { k: "Formă", v: "Lichid" },
      { k: "Ambalaj", v: "1 L" },
      { k: "Agent antispumant", v: "Polidimetilsiloxan (PDMS)" },
      { k: "Conține", v: "Agent adeziv" },
      { k: "Pauză până la recoltare", v: "Nu este cazul" },
      { k: "Valabilitate", v: "2 ani" },
      { k: "Păstrare", v: "În ambalajul original, bine închis, la 5–25°C" },
    ],
    // flyer: "/flyere/produs15.pdf",
  },
  16: {
    name: "Alar 85 SG – regulator de creștere pentru crizanteme și Crăciuniță",
    // origin: { country: "Netherlands", code: "nl" }, // completează țara de fabricație, dacă o știi
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Regulator de creștere pentru crizantemele în ghiveci și Crăciuniță (poinsettia). Scurtează internodurile, pentru plante compacte, cu creștere și înflorire uniformă.",
    // --- pagina de detalii ---
    intro: "Alar 85 SG este un regulator de creștere și dezvoltare a plantelor, sub formă de granule solubile în apă (SG). Este destinat crizantemelor cultivate în ghiveci și Crăciuniței (poinsettia). Scurtează internodurile, adică distanța dintre frunze pe tulpină, astfel încât plantele capătă un port compact și frumos, iar creșterea și înflorirea devin mai uniforme. Conține 850 g/kg daminozid și se aplică prin stropire, cu pulverizatoare manuale, inclusiv de spate.",
    features: ["Pentru crizanteme și Crăciuniță", "Plante compacte", "Înflorire uniformă", "Ambalaj 350 g"],
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p16-hero se vede

    advantages: [
      "Scurtează internodurile, pentru plante compacte, cu un port frumos",
      "Face creșterea și înflorirea mai uniforme, iar plantele din lot arată la fel",
      "Creat special pentru crizantemele în ghiveci și pentru Crăciuniță (poinsettia)",
      "Sub formă de granule solubile în apă, ușor de dozat și de preparat",
      "Fără pauză până la vânzare sau recoltare",
      "Fără restricții pentru plantele cultivate ulterior pe aceeași suprafață",
    ],

    usageTargetLabel: "Efect",
    usage: [
      { cultura: "Crizanteme în ghiveci", boli: "Scurtarea internodurilor, port compact, creștere și înflorire uniformă", doza: "0,25–0,5% (250–500 g la 100 l apă); maximum 0,5%", apa: "10–15 l/100 m²", perioada: "Primul tratament când lăstarii laterali au 5–10 cm, adică la circa 2–3 săptămâni după ciupire. Se stropesc plantele uscate, bine hidratate.", tratamente: "2", interval: "14–17 zile" },
      { cultura: "Crăciuniță (poinsettia)", boli: "Scurtarea internodurilor, port compact, creștere și înflorire uniformă", doza: "0,3–0,4% (300–400 g la 100 l apă); maximum 0,4%. Doza mai mare se folosește la soiurile viguroase.", apa: "10–15 l/100 m²", perioada: "Primul tratament la plantele cu o singură tulpină, când lăstarii au 6–10 cm; la plantele ciupite (cu mai multe tulpini), când lăstarii au 3–9 cm după ciupire", tratamente: "2", interval: "21 zile" },
    ],
    usageNote: "Valorile sunt preluate din eticheta produsului. Stropiți astfel încât soluția să acopere complet frunzele și tulpinile, dar să nu se scurgă de pe plante în ghivece. Produsul acționează cel mai bine la 16–25°C și nu se amestecă cu alte produse de protecție a plantelor. Nu intrați pe suprafața tratată până când soluția nu s-a uscat complet pe plante. Produsul este destinat utilizatorilor profesioniști. Înainte de utilizare, citiți eticheta și respectați reglementările în vigoare.",

    specs: [
      { k: "Brand", v: "UPL" },
      { k: "Denumire", v: "Alar 85 SG" },
      { k: "Tip", v: "Regulator de creștere și dezvoltare a plantelor" },
      { k: "Formulare", v: "SG – granule solubile în apă" },
      { k: "Substanță activă", v: "Daminozid 850 g/kg (85%)" },
      { k: "Culturi", v: "Crizanteme în ghiveci, Crăciuniță (poinsettia)" },
      { k: "Temperatură optimă de acțiune", v: "16–25°C" },
      { k: "Ambalaj", v: "350 g" },
      { k: "Câtă soluție se obține din 350 g", v: "La 0,25%: circa 140 l; la 0,4%: circa 87 l; la 0,5%: 70 l" },
      { k: "Pauză până la recoltare", v: "Nu este necesară" },
      { k: "Valabilitate", v: "2 ani" },
    ],
    // flyer: "/flyere/produs16.pdf",
  },
  17: {
    name: "Blackjak – îngrășământ cu acizi humici și fulvici",
    // origin: { country: "Poland", code: "pl" }, // completează țara de fabricație, dacă o știi
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Suspensie concentrată de acizi humici, fulvici și ulmici, cu microelemente, pentru udarea la rădăcină, stropirea pe frunze și înmuierea semințelor. Pentru flori, legume, căpșuni și pomi.",
    // --- pagina de detalii ---
    intro: "Blackjak este o suspensie concentrată de acizi humici, fulvici și ulmici, cu microelemente, pentru înmuierea semințelor și pentru fertilizarea plantelor la rădăcină și pe frunze, pentru o recoltă bogată și de calitate. Se folosește la flori, plante ornamentale și de ghiveci, căpșuni, pomi și arbuști fructiferi, legume în câmp și în seră, cartof, morcov, sfeclă și ceapă, precum și pentru înmuierea semințelor, a bulbilor și a rădăcinilor. Stimulează dezvoltarea rădăcinilor, îmbunătățește solul și ajută plantele să absoarbă mai bine îngrășămintele și produsele de protecție.",
    features: ["Acizi humici și fulvici", "Pentru flori și plante de ghiveci", "Udare și stropire foliară", "Canistră 5 L"],
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p17-hero se vede

    advantages: [
      "Înmuierea semințelor, a bulbilor, a tuberculilor sau a rădăcinilor îmbunătățește răsărirea, vigoarea și dezvoltarea plantelor",
      "Udarea la rădăcină stimulează în mod deosebit dezvoltarea sistemului radicular",
      "Crește recolta",
      "Îmbunătățește formarea zaharurilor și a amidonului și stimulează creșterea plantelor",
      "Îmbunătățește solul: microelementele și macroelementele se eliberează mai ușor, iar plantele le absorb mai repede",
      "În solurile grele, argiloase, desface bulgării, iar solul devine mai afânat, cu o activitate mai bună a microorganismelor și o circulație mai bună a aerului și a apei",
      "Amestecat cu produse de protecție și cu îngrășăminte, le crește eficiența",
      "Grăbește și îmbunătățește acțiunea și absorbția produselor de protecție și a îngrășămintelor foliare",
      "Ajută la scăderea pH-ului soluțiilor de stropit",
    ],

    usageLabels: { boli: "Udare la rădăcină", doza: "Stropire pe frunze" },
    usage: [
      { cultura: "Flori, plante ornamentale și de ghiveci", boli: "20 ml la 5 l apă, o dată pe lună", doza: "–" },
      { cultura: "Căpșun", boli: "Pe rânduri: 20 ml la 10 l apă / 100 m²", doza: "Până la înflorire: 40 ml la 10 l apă / 100 m²" },
      { cultura: "Cartof", boli: "Pe rânduri: 20 ml la 10 l apă / 100 m²", doza: "Când plantele au 20–25 cm: 50 ml la 10 l apă / 100 m²; se repetă după 2–3 săptămâni" },
      { cultura: "Morcov și ceapă", boli: "Pe rânduri: 20 ml la 5 l apă / 100 m²", doza: "50 ml la 10 l apă / 100 m²; se repetă după 2–3 săptămâni" },
      { cultura: "Sfeclă roșie și sfeclă furajeră", boli: "La pregătirea solului: 40 ml la 10 l apă / 100 m²; pe rânduri, după semănat: 20 ml la 10 l apă / 100 m²", doza: "Prima dată la 10–12 săptămâni după semănat: 100 ml la 10 l apă / 100 m²; a doua oară după 2–3 săptămâni" },
      { cultura: "Legume în câmp", boli: "Pe rânduri, după semănat: 20 ml la 10 l apă / 100 m²", doza: "Când plantele au 20–25 cm: 25 ml la 10 l apă / 100 m²; dacă e nevoie, se repetă după 3 săptămâni" },
      { cultura: "Legume în seră", boli: "După semănat sau plantare, pe rânduri: 20 ml la 10 l apă / 100 m²; prin picurare, la fiecare 3–4 săptămâni. La transplantare: 20 ml la 10 l apă", doza: "–" },
      { cultura: "Pomi fructiferi (sămânțoase și sâmburoase)", boli: "La pornirea în vegetație: 25 ml la 10 l apă / pom", doza: "Împreună cu îngrășăminte foliare, regulatori de creștere sau produse de protecție: 5 ml la 10 l apă" },
    ],
    usageNote: "100 m² înseamnă un ar. Blackjak se poate folosi împreună cu alte îngrășăminte și cu produse de protecție a plantelor.",

    stepsTitle: "Prepararea soluției și alte utilizări",
    steps: [
      "Umpleți rezervorul pulverizatorului cu apă până la jumătate.",
      "Adăugați cantitatea recomandată de Blackjak și, dacă doriți, îngrășăminte foliare sau produse de protecție a plantelor.",
      "Completați rezervorul cu apă, amestecați soluția și stropiți.",
    ],
    stepsAfter: [
      "Înmuierea semințelor: cu o zi înainte de semănat, înmuiați semințele în soluție de 5 ml la 1 l apă, pentru o răsărire mai rapidă. Semințele mari și bulbii (cartof, ceapă etc.) se înmuie tot cu o zi înainte, în soluție de 25 ml la 10 l apă.",
      "Irigare prin picurare la legume: imediat după plantare, apoi la fiecare 3–4 săptămâni, 30–50 ml la 10 l apă / 100 m².",
      "În amestec cu îngrășăminte foliare: 5 ml de Blackjak la 10 l apă.",
      "Pentru scăderea pH-ului soluției din rezervor: 5 ml de Blackjak la 10 l apă.",
    ],

    specs: [
      { k: "Brand", v: "Sumi Agro" },
      { k: "Denumire", v: "Blackjak" },
      { k: "Tip", v: "Suspensie concentrată de acizi humici și fulvici, cu microelemente" },
      { k: "Materie organică", v: "Minimum 28%" },
      { k: "Acizi humici, fulvici și ulmici", v: "Minimum 20%" },
      { k: "Azot organic (N)", v: "1,1%" },
      { k: "pH", v: "4–5" },
      { k: "Mod de aplicare", v: "Udare la rădăcină, stropire pe frunze, irigare prin picurare, înmuierea semințelor" },
      { k: "Ambalaj", v: "5 L" },
      { k: "Suprafață fertilizată cu 5 L (la 20 ml / 100 m²)", v: "Circa 2,5 ha" },
    ],
    // flyer: "/flyere/produs17.pdf",
  },
  18: {
    name: "Shirudo – acaricid împotriva păianjenilor și acarienilor",
    // origin: { country: "Belgium", code: "be" }, // completează țara de fabricație, dacă o știi
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Insecto-acaricid cu tebufenpirad, împotriva păianjenului roșu și a acarienilor la pomi, viță-de-vie și legume în seră. Combate toate stadiile, de la ouă la adulți.",
    // --- pagina de detalii ---
    intro: "Shirudo este un insecto-acaricid care se aplică prin stropire pe frunze, la apariția acarienilor. Combate diferite specii de acarieni și păianjenul roșu al pomilor, în pomicultură, în viticultură și la legumele din seră. Acționează asupra tuturor stadiilor de dezvoltare, de la ouăle de vară până la adulți. Substanța activă, tebufenpiradul, acționează prin contact și ingestie, iar datorită acțiunii translaminare combate acarienii pe ambele fețe ale frunzelor și rămâne eficient și după ploi abundente.",
    features: ["Acaricid", "Acționează pe ouă, larve și adulți", "Rezistent la ploaie", "Ambalaj 100 g"],
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p18-hero se vede

    applicationsTitle: "Dăunători combătuți",
    applicationsNoIcon: true, // fără romburile din fața fiecărui rând
    applications: [
      "Păianjenul roșu al pomilor (Panonychus ulmi)",
      "Acarianul roșu comun (Tetranychus urticae)",
      "Acarianul galben al viței-de-vie (Eotetranychus carpini)",
    ],

    advantages: [
      "Acaricid cu spectru larg de combatere, cu acțiune suplimentară și asupra altor dăunători",
      "Eficacitate excelentă în toate stadiile de creștere și dezvoltare a acarienilor: ouă de vară, larve și adulți",
      "Acțiune de lungă durată",
      "Nu este influențat de condițiile meteo și rămâne eficient și după ploi abundente",
      "Acțiune translaminară: combate acarienii pe ambele fețe ale frunzelor",
      "Efect de șoc asupra dăunătorilor țintă",
      "Acționează prin contact direct și prin ingestie",
      "Sigur pentru majoritatea insectelor utile și a polenizatorilor, conform producătorului",
    ],

    usageTargetLabel: "Dăunători combătuți",
    usage: [
      { cultura: "Măr", boli: "Păianjenul roșu al pomilor (Panonychus ulmi), acarianul roșu comun (Tetranychus urticae)", doza: "0,5 kg/ha", perioada: "La apariție, după eclozarea ouălor", tratamente: "1", pauza: "7 zile" },
      { cultura: "Păr", boli: "Păianjenul roșu al pomilor (Panonychus ulmi), acarianul roșu comun (Tetranychus urticae)", doza: "0,5 kg/ha", perioada: "La apariție, după eclozarea ouălor", tratamente: "1", pauza: "7 zile" },
      { cultura: "Piersic și nectarin", boli: "Păianjenul roșu al pomilor (Panonychus ulmi), acarianul roșu comun (Tetranychus urticae)", doza: "0,5–0,6 kg/ha, în funcție de gradul de infestare", perioada: "La apariție, după eclozarea ouălor", tratamente: "1", pauza: "14 zile" },
      { cultura: "Prun", boli: "Păianjenul roșu al pomilor (Panonychus ulmi), acarianul roșu comun (Tetranychus urticae)", doza: "0,5–0,6 kg/ha", perioada: "La apariție, după eclozarea ouălor", tratamente: "1", pauza: "14 zile" },
      { cultura: "Viță-de-vie", boli: "Păianjenul roșu al pomilor (Panonychus ulmi), acarianul roșu comun (Tetranychus urticae), acarianul galben al viței-de-vie (Eotetranychus carpini)", doza: "0,375–0,5 kg/ha, în funcție de gradul de infestare", perioada: "La apariție, după eclozarea ouălor", tratamente: "1", pauza: "28 zile" },
      { cultura: "Căpșun (în seră și spații protejate)", boli: "Acarianul roșu comun (Tetranychus urticae)", doza: "1 kg/ha", perioada: "La apariție, după eclozarea ouălor", tratamente: "1", pauza: "3 zile" },
      { cultura: "Tomate, vinete, castraveți și dovlecei (în seră și spații protejate)", boli: "Acarianul roșu comun (Tetranychus urticae)", doza: "1 kg/ha", perioada: "La apariție, după eclozarea ouălor", tratamente: "1", pauza: "3 zile" },
      { cultura: "Pepene galben și pepene verde (în seră și spații protejate)", boli: "Acarianul roșu comun (Tetranychus urticae)", doza: "1 kg/ha", perioada: "La apariție, după eclozarea ouălor", tratamente: "1", pauza: "3 zile" },
    ],
    usageNote: "Valorile sunt preluate din eticheta produsului. Pentru suprafețe mici: 0,5 kg/ha înseamnă 5 g la 100 m², iar 1 kg/ha înseamnă 10 g la 100 m². Cantitatea de soluție depinde de echipament și poate fi între 200 și 1000 l/ha, la o presiune de minimum 2 bari. Pentru a evita apariția rezistenței, faceți o singură aplicare de Shirudo pe sezon pe fiecare cultură și nu folosiți în același sezon, pe aceeași cultură, alte acaricide din aceeași grupă (METI). Înainte de utilizare, citiți eticheta și respectați reglementările în vigoare.",

    specs: [
      { k: "Denumire", v: "Shirudo" },
      { k: "Tip", v: "Insecto-acaricid" },
      { k: "Substanță activă", v: "Tebufenpirad 200 g/kg" },
      { k: "Formulare", v: "WP – pulbere umectabilă" },
      { k: "Mod de acțiune", v: "Contact și ingestie, translaminar" },
      { k: "Grupa de rezistență", v: "METI-I (IRAC grupa 21)" },
      { k: "Cantitate de soluție", v: "200–1000 l/ha, presiune minimă 2 bari" },
      { k: "Certificat de omologare", v: "856PC / 25.04.2023" },
      { k: "Clasificare", v: "Atenție" },
      { k: "Ambalaj", v: "100 g" },
      { k: "Suprafață tratată cu 100 g", v: "La 0,5 kg/ha: circa 2.000 m²; la 1 kg/ha: circa 1.000 m²" },
    ],
    // flyer: "/flyere/produs18.pdf",
  },
  19: {
    name: "Ridomil Gold R – fungicid împotriva manei",
    // origin: { country: "Switzerland", code: "ch" }, // completează țara de fabricație, dacă o știi
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Fungicid Syngenta cu metalaxil-M și cupru, împotriva manei la cartof, tomate, ceapă și viță-de-vie. Se aplică preventiv sau la primele simptome.",
    // --- pagina de detalii ---
    intro: "Ridomil Gold R este un fungicid sub formă de granule dispersabile în apă (WG), cu două substanțe active care se completează: metalaxil-M (19,4 g/kg), din grupa fenilamidelor, și cupru sub formă de oxiclorură de cupru (141,9 g/kg), cu acțiune în mai multe puncte. Protejează cartoful și tomatele cultivate în seră împotriva manei (Phytophthora infestans), vița-de-vie împotriva manei viței-de-vie și ceapa împotriva manei cepei. Se aplică preventiv sau imediat după apariția primelor simptome, prin stropire cu picături fine.",
    features: ["Sistemic și de contact", "Preventiv și la primele simptome", "Risc redus de rezistență", "Ambalaj 1 kg"],
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p19-hero se vede

    coverTitle: "Cum acționează cele două substanțe active?",
    coverText:
      "Metalaxil-M acționează sistemic: pătrunde în țesuturile plantei și oprește sinteza acizilor nucleici ai agentului patogen, adică îl împiedică să se înmulțească. Cuprul formează o barieră protectoare pe suprafața plantei și dereglează procesele metabolice ale patogenului la nivel celular. Pentru că acționează în moduri diferite, combinația celor două asigură o protecție eficientă și reduce riscul de apariție a rezistenței.",

    applicationsTitle: "Culturi și boli combătute",
    applicationsNoIcon: true, // fără romburile din fața fiecărui rând
    applications: [
      "Cartof – mana cartofului",
      "Tomate (în seră și spații protejate) – mana",
      "Viță-de-vie (în câmp) – mana viței-de-vie",
      "Ceapă (în câmp) – mana cepei",
    ],

    advantages: [
      "Două substanțe active cu moduri de acțiune complementare: sistemic (metalaxil-M) și de contact (cupru)",
      "Protejează planta atât din interior, cât și la suprafață",
      "Combate eficient mana la cartof, tomate, ceapă și viță-de-vie",
      "Se aplică preventiv sau imediat după apariția primelor simptome",
      "Combinația celor două substanțe reduce riscul de apariție a rezistenței",
      "Produs Syngenta, unul dintre cele mai cunoscute fungicide împotriva manei",
    ],

    usageTargetLabel: "Boala combătută",
    usage: [
      { cultura: "Cartof", boli: "Mana cartofului", doza: "5 kg/ha (50 g la 100 m²)", tratamente: "2", interval: "min. 10 zile", pauza: "20 zile" },
      { cultura: "Tomate (în seră și spații protejate)", boli: "Mana", doza: "2,5–2,94 kg la 10.000 m² de suprafață foliară; maximum 5 kg/ha", tratamente: "2", interval: "min. 10 zile", pauza: "3 zile" },
      { cultura: "Viță-de-vie (în câmp)", boli: "Mana viței-de-vie", doza: "2,5–2,94 kg la 10.000 m² de suprafață foliară; maximum 5 kg/ha", tratamente: "2", interval: "min. 10 zile", pauza: "28 zile" },
      { cultura: "Ceapă (în câmp)", boli: "Mana cepei", doza: "5 kg/ha (50 g la 100 m²)", tratamente: "2", interval: "min. 10 zile", pauza: "14 zile" },
    ],
    usageNote: "Se aplică preventiv sau imediat după apariția primelor simptome, prin stropire cu picături fine, cu 150–600 l apă/ha. La tomate și la viță-de-vie, doza se calculează la suprafața peretelui de frunze (LWA), nu la suprafața terenului. Cantitatea totală de cupru din toate produsele folosite nu trebuie să depășească 4 kg/ha pe sezon. „Nr. max. tratamente” înseamnă numărul maxim de tratamente pe sezon. Înainte de utilizare, citiți eticheta și respectați reglementările în vigoare.",

    stepsTitle: "Siguranță și protecția mediului",
    steps: [
      "Purtați mănuși și îmbrăcăminte de protecție în timpul lucrului.",
      "Păstrați o zonă de protecție înierbată față de ape și cursuri de apă: 20 m la cartof, ceapă și tomate și 40 m la viță-de-vie, folosind în același timp echipamente care reduc cu 90% deriva soluției.",
      "Păstrați produsul la 0–30°C, în ambalajul original, departe de copii și de animale.",
    ],
    stepsAfter: [
      "Produsul este foarte toxic pentru organismele acvatice, cu efecte de lungă durată. Nu-l folosiți lângă ape.",
      "Predați ambalajele goale și resturile de produs la un punct de colectare a deșeurilor periculoase.",
    ],

    specs: [
      { k: "Producător", v: "Syngenta" },
      { k: "Denumire", v: "Ridomil Gold R" },
      { k: "Tip", v: "Fungicid sistemic și de contact" },
      { k: "Substanțe active", v: "Metalaxil-M 19,4 g/kg (1,94%); cupru, sub formă de oxiclorură de cupru, 141,9 g/kg (14,19%)" },
      { k: "Grupe FRAC", v: "4 (metalaxil-M) și M01 (cupru)" },
      { k: "Formulare", v: "WG – granule dispersabile în apă" },
      { k: "Culturi", v: "Cartof, tomate în seră, viță-de-vie, ceapă" },
      { k: "Cantitate de apă", v: "150–600 l/ha" },
      { k: "Nr. maxim de tratamente pe sezon", v: "2, la minimum 10 zile" },
      { k: "Ambalaj", v: "1 kg" },
      { k: "Cod EAN", v: "5905527272808" },
      { k: "Suprafață tratată cu 1 kg (la 5 kg/ha)", v: "Circa 2.000 m²" },
    ],
    // flyer: "/flyere/produs19.pdf",
  },
  20: {
    name: "Chryzotop Green 0,25% – pudră de înrădăcinare pentru butași",
    origin: { country: "Netherlands", code: "nl" },
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Pudră Rhizopon cu acid indolilbutiric (IBA), gata de utilizare, care stimulează formarea rădăcinilor la butașii de plante ornamentale.",
    // --- pagina de detalii ---
    intro: "Chryzotop Green 0,25% de la Rhizopon este o pudră de înrădăcinare care stimulează formarea rădăcinilor la butași. Conține 0,25% acid indolilbutiric (IBA), o auxină care favorizează creșterea rădăcinilor și apariția rădăcinilor laterale. Formularea face ca substanța activă să rămână lipită de butaș. Cu mai multe rădăcini și de calitate mai bună, butașii absorb mai bine apa și nutrienții, produc mai multă energie și devin mai rezistenți la boli. Produsul este gata de utilizare și nu se diluează: baza butașului se înmoaie direct în pudră.",
    features: ["Pudră gata de utilizare", "Stimulează înrădăcinarea", "Pentru butași de plante ornamentale", "Ambalaj 10 kg"],
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p20-hero se vede

    advantages: [
      "Îmbunătățește atât cantitatea, cât și calitatea rădăcinilor formate",
      "Stimulează apariția rădăcinilor laterale",
      "Formularea face ca substanța activă să rămână lipită de butaș",
      "Butașii înrădăcinați absorb mai bine apa și nutrienții, produc mai multă energie și sunt mai rezistenți la boli",
      "Gata de utilizare, fără diluare sau amestecare",
      "Un singur tratament pe ciclu de cultură, înainte de plantare",
      "Nu este clasificat ca periculos, conform fișei cu date de securitate",
    ],

    stepsTitle: "Mod de utilizare",
    steps: [
      "Umeziți cu apă baza butașilor neînrădăcinați.",
      "Înmuiați ultimii 1–2 cm ai butașilor în pudră, astfel încât pudra să se distribuie uniform.",
      "Îndepărtați excesul de pudră prin scuturare ușoară, apoi plantați butașii în substrat.",
    ],
    stepsAfter: [
      "Cantitatea de pudră pe butaș depinde de grosimea și structura acestuia.",
      "Se face un singur tratament pe ciclu de cultură.",
      "Sensibilitatea diferă mult de la o specie și de la un soi la altul. Dacă nu ați mai folosit produsul pe o anumită cultură, faceți mai întâi un tratament de probă.",
      "Lucrați într-un spațiu bine ventilat, purtați mănuși și ochelari de protecție și nu mâncați, nu beți și nu fumați în timpul lucrului.",
    ],

    specs: [
      { k: "Producător", v: "Rhizopon (Olanda)" },
      { k: "Denumire", v: "Chryzotop Green 0,25%" },
      { k: "Tip", v: "Regulator de creștere, pudră de înrădăcinare" },
      { k: "Substanță activă", v: "Acid indolilbutiric (IBA) 0,25% (2,5 g/kg)" },
      { k: "Formă", v: "Pudră verde, fără miros, gata de utilizare" },
      { k: "Utilizare", v: "Butași de plante ornamentale, la înmulțirea în spații protejate" },
      { k: "Mod de aplicare", v: "Înmuierea bazei butașului (1–2 cm) în pudră" },
      { k: "Nr. maxim de tratamente", v: "1 pe ciclu de cultură" },
      { k: "Păstrare", v: "În ambalajul original, bine închis, într-un loc uscat și răcoros (10–20°C)" },
      { k: "Ambalaj", v: "10 kg" },
    ],
    // flyer: "/flyere/produs20.pdf",
  },
  21: {
    name: "Spintor 240 SC – insecticid pentru legume",
    // origin: { country: "USA", code: "us" }, // completează țara de fabricație, dacă o știi
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Insecticid Corteva cu spinosad, de origine naturală, împotriva gândacului din Colorado, a omizilor de pe varză și a tripșilor. Selectiv pentru insectele utile.",
    // --- pagina de detalii ---
    intro: "Spintor 240 SC este un insecticid sub formă de suspensie concentrată, care se diluează cu apă. Acționează prin contact, prin ingestie și asupra ouălor și combate unii dăunători care rod plantele, la cartof și la legume. Pe plantă acționează la suprafață și în profunzimea frunzei, aceasta din urmă doar la frunzele tinere. Substanța activă, spinosadul, este un produs natural din grupa lactonelor macrociclice. Pentru că este selectiv față de insectele utile, produsul este potrivit pentru programele de protecție integrată a plantelor.",
    features: ["Substanță activă naturală", "Selectiv pentru insectele utile", "Pauză scurtă: 3 zile", "Flacon 250 ml"],
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p21-hero se vede

    applicationsTitle: "Dăunători combătuți",
    applicationsNoIcon: true, // fără romburile din fața fiecărui rând
    applications: [
      "Gândacul din Colorado (larve)",
      "Fluturele alb al verzei",
      "Fluturele alb al napului",
      "Buha verzei",
      "Tripsul tutunului",
      "Tripsul californian (în seră)",
    ],

    advantages: [
      "Acțiune rapidă și eficacitate ridicată",
      "Acțiune de durată mai lungă decât la alte preparate",
      "Pauză scurtă până la recoltare: 3 zile",
      "Sigur pentru culturi și pentru mediu",
      "Acționează prin contact, prin ingestie și asupra ouălor dăunătorilor",
      "Selectiv pentru insectele utile, potrivit pentru protecția integrată a plantelor",
      "Substanță activă de origine naturală (spinosad)",
    ],

    usageTargetLabel: "Dăunători combătuți",
    usage: [
      { cultura: "Cartof", boli: "Gândacul din Colorado (larve)", doza: "0,1–0,15 l/ha; maximum 0,15 l/ha", apa: "150–400 l/ha", perioada: "Pe larvele cele mai tinere; doza mai mare la atac puternic, la larve mai mari și la vrejuri bogate", tratamente: "3", interval: "min. 14 zile" },
      { cultura: "Varză albă", boli: "Fluturele alb al verzei, fluturele alb al napului, buha verzei", doza: "0,2–0,4 l/ha", apa: "200–600 l/ha", perioada: "Pe omizile cele mai tinere; doza mai mare la atac puternic sau la omizi mai mari", tratamente: "3", interval: "7–10 zile" },
      { cultura: "Varză albă", boli: "Tripsul tutunului", doza: "0,3–0,4 l/ha", apa: "200–600 l/ha", perioada: "La apariția primelor larve și a adulților sau a primelor daune; mai ales când tripsul trece de pe ceapă pe varză (când se culcă frunzele cepei)", tratamente: "3", interval: "min. 7 zile" },
      { cultura: "Conopidă și broccoli", boli: "Fluturele alb al napului, buha verzei", doza: "0,2–0,4 l/ha", apa: "200–600 l/ha", perioada: "Pe omizile cele mai tinere; doza mai mare la atac puternic sau la omizi mai mari", tratamente: "3", interval: "7–10 zile" },
      { cultura: "Ceapă și praz", boli: "Tripsul tutunului", doza: "0,3–0,4 l/ha", apa: "200–600 l/ha", perioada: "La apariția primelor larve și a adulților sau a primelor daune; doza mai mare la atac puternic, aer uscat și temperaturi ridicate", tratamente: "3", interval: "min. 7 zile" },
      { cultura: "Tomate și castraveți (în seră)", boli: "Tripsul californian", doza: "0,04% (40 ml la 100 l apă, adică 4 ml la 10 l apă)", apa: "300–2000 l/ha, în funcție de înălțimea și desimea plantelor", perioada: "La apariția adulților; dacă e nevoie, se repetă după 7–10 zile", tratamente: "4", interval: "7–10 zile" },
    ],
    usageNote: "Pentru suprafețe mici: 0,1–0,15 l/ha înseamnă 1–1,5 ml la 100 m², iar 0,2–0,4 l/ha înseamnă 2–4 ml la 100 m². „Nr. max. tratamente” înseamnă numărul maxim de tratamente pe sezon. Se recomandă stropirea cu picături medii. Înainte de utilizare, citiți eticheta și respectați reglementările în vigoare.",

    specs: [
      { k: "Producător", v: "Corteva Agriscience" },
      { k: "Denumire", v: "Spintor 240 SC" },
      { k: "Tip", v: "Insecticid" },
      { k: "Substanță activă", v: "Spinosad (spinozină A și spinozină D) 240 g/l (22,72%)" },
      { k: "Formulare", v: "SC – suspensie concentrată, se diluează cu apă" },
      { k: "Mod de acțiune", v: "Contact, ingestie și ovicid; de suprafață și translaminar (la frunzele tinere)" },
      { k: "Culturi", v: "Cartof, varză albă, conopidă, broccoli, ceapă, praz, tomate și castraveți în seră" },
      { k: "Pauză până la recoltare", v: "3 zile" },
      { k: "Ambalaj", v: "250 ml" },
      { k: "Cât tratează 250 ml", v: "La 0,4 l/ha: circa 6.250 m²; în seră, la 0,04%: circa 625 l de soluție" },
    ],
    // flyer: "/flyere/produs21.pdf",
  },
  22: {
    name: "B-Nine 85 SG – regulator de creștere pentru crizanteme și Crăciuniță",
    // origin: { country: "Netherlands", code: "nl" }, // completează țara de fabricație, dacă o știi
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Regulator de creștere UPL pentru crizantemele în ghiveci și Crăciuniță (poinsettia). Scurtează internodurile, pentru plante compacte, cu creștere și înflorire uniformă.",
    // --- pagina de detalii ---
    intro: "B-Nine 85 SG este un regulator de creștere și dezvoltare a plantelor, sub formă de granule solubile în apă (SG). Se folosește la crizantemele cultivate în ghiveci și la Crăciuniță (poinsettia) pentru a scurta internodurile, adică distanța dintre frunze pe tulpină. Astfel, plantele capătă un port compact și frumos, iar creșterea și înflorirea devin mai uniforme. Conține 850 g/kg daminozid.",
    features: ["Pentru crizanteme și Crăciuniță", "Plante compacte", "Înflorire uniformă", "Ambalaj 350 g"],
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p22-hero se vede

    advantages: [
      "Scurtează internodurile, pentru plante compacte, cu un port frumos",
      "Face creșterea și înflorirea mai uniforme, iar plantele din lot arată la fel",
      "Creat special pentru crizantemele în ghiveci și pentru Crăciuniță (poinsettia)",
      "Sub formă de granule solubile în apă, ușor de dozat și de preparat",
      "Fără pauză până la recoltare și fără restricții pentru intrarea pe suprafața tratată",
      "Fără perioadă de protecție pentru albine și fără restricții pentru culturile următoare",
    ],

    usageTargetLabel: "Efect",
    usage: [
      { cultura: "Crizanteme în ghiveci", boli: "Scurtarea internodurilor, port compact, creștere și înflorire uniformă", doza: "0,25–0,5% (250–500 g la 100 l apă); maximum 0,5%", apa: "10–15 l/100 m²", perioada: "Primul tratament când lăstarii laterali au 5–10 cm, adică la circa 2–3 săptămâni după ciupire. Se stropesc plantele uscate, bine hidratate.", tratamente: "2", interval: "14–17 zile" },
      { cultura: "Crăciuniță (poinsettia)", boli: "Scurtarea internodurilor, port compact, creștere și înflorire uniformă", doza: "0,3–0,4% (300–400 g la 100 l apă); maximum 0,4%. Doza mai mare se folosește la soiurile viguroase.", apa: "10–15 l/100 m²", perioada: "Primul tratament la plantele cu o singură tulpină, când lăstarii au 6–10 cm; la plantele ciupite (cu mai multe tulpini), când lăstarii au 3–9 cm după ciupire", tratamente: "2", interval: "21 zile" },
    ],
    usageNote: "Stropiți astfel încât soluția să acopere complet frunzele și tulpinile, dar să nu se scurgă de pe plante în ghivece. Produsul acționează cel mai bine la 16–25°C și nu se amestecă cu alte produse de protecție a plantelor. Produsul este destinat utilizatorilor profesioniști. Înainte de utilizare, citiți eticheta și respectați reglementările în vigoare.",

    stepsTitle: "Prepararea soluției și măsuri de siguranță",
    steps: [
      "Stabiliți exact cantitatea de soluție de care aveți nevoie și cântăriți produsul.",
      "Amestecați produsul cântărit cu puțină apă, într-un vas separat, apoi turnați-l printr-o sită în rezervorul pulverizatorului umplut parțial cu apă.",
      "Clătiți de trei ori ambalajul gol cu apă și turnați apa de clătire în rezervor. Completați cu apă până la cantitatea necesară și amestecați bine.",
    ],
    stepsAfter: [
      "După lucru, spălați bine echipamentul.",
      "Purtați îmbrăcăminte de protecție și nu mâncați și nu beți în timpul lucrului. Conform etichetei, substanța este suspectată că poate provoca cancer: citiți toate măsurile de siguranță înainte de utilizare.",
      "În caz de înghițire, cereți imediat sfatul medicului și arătați-i ambalajul sau eticheta.",
      "Păstrați produsul sub cheie, departe de copii.",
    ],

    specs: [
      { k: "Brand", v: "UPL" },
      { k: "Denumire", v: "B-Nine 85 SG" },
      { k: "Tip", v: "Regulator de creștere și dezvoltare a plantelor" },
      { k: "Formulare", v: "SG – granule solubile în apă" },
      { k: "Substanță activă", v: "Daminozid 850 g/kg (85%)" },
      { k: "Culturi", v: "Crizanteme în ghiveci, Crăciuniță (poinsettia)" },
      { k: "Temperatură optimă de acțiune", v: "16–25°C" },
      { k: "Ambalaj", v: "350 g" },
      { k: "Câtă soluție se obține din 350 g", v: "La 0,25%: circa 140 l; la 0,4%: circa 87 l; la 0,5%: 70 l" },
      { k: "Pauză până la recoltare", v: "Nu este cazul" },
      { k: "Valabilitate", v: "3 ani" },
    ],
    // flyer: "/flyere/produs22.pdf",
  },
  23: {
    name: "Planton S – îngrășământ pentru surfinii și petunii curgătoare",
    origin: { country: "Poland", code: "pl" },
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Îngrășământ solubil NPK cu fier și microelemente, pentru surfinii, petunii, calibrachoa și verbine. Frunze verzi intens și înflorire bogată tot sezonul.",
    // --- pagina de detalii ---
    intro: "Planton S este un îngrășământ profesional, complex, creat pentru plantele de balcon care au nevoie de mai mult fier, precum surfiniile, petuniile, supertuniile, calibrachoa (Superbells) și verbinele. Completează lipsa elementelor minerale din substrat și asigură frunze de un verde intens, o creștere mai rapidă și o înflorire bogată. Conținutul ridicat de fier ușor asimilabil previne decolorarea frunzelor și ofilirea tulpinilor. Folosit regulat, întărește plantele și le ajută să se refacă, mai ales după ploi, care spală nutrienții din substrat. Este 100% solubil în apă, iar dintr-o pungă se obțin 200 l de soluție.",
    features: ["Pentru surfinii și petunii", "Cu fier ușor asimilabil", "100% solubil în apă", "200 l de soluție"],
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p23-hero se vede

    applicationsTitle: "Recomandat pentru",
    applicationsNoIcon: true, // fără romburile din fața fiecărui rând
    applications: [
      "Surfinii",
      "Petunii curgătoare",
      "Supertunii",
      "Calibrachoa (Superbells)",
      "Verbine",
      "Alte plante de balcon și de grădină",
    ],

    advantages: [
      "Randament mare: o pungă ajunge pentru 200 l de soluție",
      "Compoziție echilibrată, care susține creșterea, dezvoltarea și înflorirea plantelor de balcon",
      "Fierul adăugat previne decolorarea frunzelor și ofilirea plantelor",
      "Fierul chelatat se absoarbe bine într-un interval larg de pH",
      "Complet solubil în apă",
      "Se poate folosi și la nevoie: ajută în caz de lipsă de fier și după ploi",
      "Se poate folosi la fiecare udare, fără risc de supra-fertilizare",
      "Ambalaj doypack care se poate închide din nou, protejează îngrășământul de umezeală și nu se varsă",
    ],

    stepsTitle: "Mod de utilizare",
    steps: [
      "Dizolvați 1–2 lingurițe pline de Planton S în 10 l de apă. Cantitatea depinde de mărimea plantelor.",
      "Udați plantele cu soluția la fiecare udare, pe toată perioada de vegetație.",
      "Continuați fertilizarea și când plouă, pentru că ploaia spală nutrienții din substrat.",
    ],
    stepsAfter: [
      "Puteți pregăti și un concentrat: dizolvați toată punga în 1 l de apă, apoi folosiți 50 ml de concentrat la 10 l de apă.",
    ],

    specs: [
      { k: "Producător", v: "Planta (Polonia)" },
      { k: "Denumire", v: "Planton S" },
      { k: "Tip", v: "Îngrășământ solubil NPK cu microelemente" },
      { k: "NPK", v: "16-8-24" },
      { k: "Azot (N) total", v: "16% (amoniacal 4%, nitric 9%, amidic 3%)" },
      { k: "Fosfor (P₂O₅)", v: "8%" },
      { k: "Potasiu (K₂O)", v: "24%" },
      { k: "Microelemente", v: "Fier (Fe) 0,15%, mangan (Mn) 0,06%, zinc (Zn) 0,015%, cupru (Cu) 0,005%" },
      { k: "Dozare", v: "1–2 lingurițe pline la 10 l apă, la fiecare udare" },
      { k: "Ambalaj", v: "200 g (pentru 200 l de soluție)" },
    ],
    // flyer: "/flyere/produs23.pdf",
  },
  24: {
    name: "Planton B – îngrășământ pentru afine",
    origin: { country: "Poland", code: "pl" },
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Îngrășământ solubil NPK 16-6-15 cu microelemente, pentru afine. Asigură o creștere corectă și recolte bogate și acidifică solul.",
    // --- pagina de detalii ---
    intro: "Planton B este un îngrășământ modern pentru afine. Asigură o creștere corectă a plantelor și recolte bogate și are acțiune acidifiantă, potrivită pentru afine, care preferă un sol acid. Conține NPK 16-6-15 și microelemente ușor asimilabile: cupru, fier, mangan și zinc. Este 100% solubil în apă, are o rețetă verificată, iar dintr-o pungă se obțin 200 l de soluție. Se aplică la rădăcină, prin udarea solului de la baza plantelor.",
    features: ["Pentru afine", "Acidifiază solul", "100% solubil în apă", "200 l de soluție"],
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p24-hero se vede

    advantages: [
      "Recolte bogate și creștere corectă a plantelor",
      "Acțiune acidifiantă, potrivită pentru cerințele afinului",
      "Compoziție completă: NPK cu cupru, fier, mangan și zinc",
      "Nutrienți ușor asimilabili de plante",
      "100% solubil în apă",
      "Randament mare: o pungă ajunge pentru 200 l de soluție",
      "Folosit regulat, o dată pe săptămână, asigură o hrănire constantă a plantelor",
    ],

    stepsTitle: "Mod de utilizare",
    steps: [
      "Dizolvați 1–2 lingurițe de Planton B în 10 l de apă, în funcție de mărimea plantelor, și amestecați până se dizolvă complet.",
      "Udați solul din jurul tufelor, la baza plantelor. Nu stropiți pe frunze.",
      "Repetați o dată pe săptămână, din aprilie până la sfârșitul lunii iulie.",
    ],
    stepsAfter: [
      "Puteți pregăti și un concentrat: dizolvați toată punga în 1 l de apă, apoi folosiți 50 ml de concentrat la 10 l de apă.",
      "Păstrați produsul în ambalajul original, bine închis, într-un loc uscat și întunecat, departe de copii, de alimente și de hrana animalelor. Nu se consumă.",
    ],

    specs: [
      { k: "Producător", v: "Plantpol Zaborze (Polonia)" },
      { k: "Denumire", v: "Planton B" },
      { k: "Tip", v: "Îngrășământ solubil NPK cu microelemente" },
      { k: "NPK", v: "16-6-15" },
      { k: "Microelemente", v: "Cupru (Cu), fier (Fe), mangan (Mn), zinc (Zn)" },
      { k: "Cultură", v: "Afin" },
      { k: "Mod de aplicare", v: "La rădăcină, prin udare" },
      { k: "Dozare", v: "1–2 lingurițe la 10 l apă, o dată pe săptămână" },
      { k: "Perioada de aplicare", v: "Aprilie – sfârșitul lunii iulie" },
      { k: "Ambalaj", v: "200 g (pentru 200 l de soluție)" },
    ],
    // flyer: "/flyere/produs24.pdf",
  },
  25: {
    name: "Planton K – îngrășământ pentru mușcate și alte plante cu flori",
    origin: { country: "Poland", code: "pl" },
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Îngrășământ specializat, complet solubil, pentru mușcate (pelargonii) și alte plante cu flori. Susține o înflorire bogată și o creștere sănătoasă.",
    // --- pagina de detalii ---
    intro: "Planton K este un îngrășământ specializat, complet solubil în apă, pentru mușcate (pelargonii) și alte plante cu flori, cu o compoziție testată și dovedită. Are formula NPK 16-1-24: mult potasiu pentru flori numeroase și bine colorate, azot pentru frunziș sănătos și foarte puțin fosfor. Conține azot și potasiu sub formă de azotați, ușor de absorbit, precum și bor. Susține o înflorire intensă și o creștere sănătoasă a plantelor și este ușor de folosit, atât pentru plantele din casă și de pe balcon, cât și pentru cele din grădină. Dintr-o pungă se obțin până la 200 l de soluție.",
    features: ["Pentru mușcate și plante cu flori", "Înflorire bogată", "100% solubil în apă", "Până la 200 l de soluție"],
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p25-hero se vede

    advantages: [
      "Stimulează o înflorire intensă a mușcatelor",
      "Conținut ridicat de potasiu (24%), care favorizează formarea florilor",
      "Potrivit și pentru alte plante cu flori",
      "Ușor de folosit, pentru că se dizolvă complet în apă",
      "Ideal atât pentru plantele din casă și de pe balcon, cât și pentru cele din grădină",
      "Compoziție testată, pentru o creștere sănătoasă a plantelor",
      "Randament mare: o pungă de 200 g ajunge pentru o cantitate mare de soluție",
    ],

    stepsTitle: "Mod de utilizare",
    steps: [
      "Dizolvați 2 g de Planton K într-un litru de apă.",
      "Udați plantele cu soluția obținută.",
      "Repetați o dată pe săptămână, în perioada de creștere intensă și de înflorire.",
    ],
    stepsAfter: [
      "Produsul irită ochii: purtați mănuși și ochelari de protecție când lucrați cu pulberea. Dacă ajunge în ochi, clătiți cu grijă cu apă câteva minute și scoateți lentilele de contact, dacă se poate. Dacă iritația persistă, mergeți la medic.",
      "Spălați-vă pe mâini după utilizare și nu mâncați, nu beți și nu fumați în timpul lucrului.",
      "Păstrați produsul în ambalajul original, bine închis, într-un loc uscat și aerisit, ferit de căldură și de soare, departe de copii, de alimente și de hrana animalelor. Produsul absoarbe umezeala din aer.",
      "Nu păstrați produsul în recipiente de aluminiu sau din alte metale, pe care le poate deteriora.",
    ],

    specs: [
      { k: "Producător", v: "Plantpol Zaborze (Polonia)" },
      { k: "Denumire", v: "Planton K" },
      { k: "Tip", v: "Îngrășământ solubil pentru plante cu flori" },
      { k: "NPK", v: "16-1-24" },
      { k: "Compoziție", v: "Azotat de potasiu, azotat de amoniu, acid boric (sursă de bor)" },
      { k: "Formă", v: "Pulbere albă, fără miros, solubilă în apă (până la 250 g/l)" },
      { k: "Clasificare", v: "Atenție – provoacă iritarea ochilor" },
      { k: "Recomandat pentru", v: "Mușcate (pelargonii) și alte plante cu flori" },
      { k: "Dozare", v: "2 g la 1 l apă, o dată pe săptămână" },
      { k: "Ambalaj", v: "200 g" },
    ],
    // flyer: "/flyere/produs25.pdf",
  },
  26: {
    name: "Prokka WP – insecticid cu acțiune rapidă și de lungă durată",
    // origin: { country: "Moldova", code: "md" }, // completează țara de fabricație, dacă o știi
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Insecticid translaminar și de contact, cu emamectin benzoat și lambda-cihalotrin, împotriva viermelui mărului, a omizilor, a afidelor și a altor dăunători.",
    // --- pagina de detalii ---
    intro: "Prokka WP este un insecticid translaminar și de contact, cu acțiune rapidă și efect de lungă durată, sub formă de pulbere umectabilă (WP). Combină două substanțe active din grupe diferite. Emamectin benzoatul (din grupa avermectinelor) acționează și asupra ouălor omizilor de fluturi: blochează mușchii dăunătorului, care nu se mai poate mișca și hrăni și moare. Lambda-cihalotrinul (un piretroid sintetic) acționează prin contact și ingestie, are și efect de respingere și distruge sistemul nervos al dăunătorului. Se folosește la măr, viță-de-vie, floarea-soarelui și rapiță.",
    features: ["Acțiune rapidă", "Efect de lungă durată", "Două substanțe active", "Ambalaj 1 kg"],
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p26-hero se vede

    applicationsTitle: "Dăunători combătuți",
    applicationsNoIcon: true, // fără romburile din fața fiecărui rând
    applications: [
      "Viermele mărului",
      "Buhe (inclusiv buha fructificațiilor)",
      "Fluturele de pajiște",
      "Molii",
      "Molia verzei",
      "Afide",
      "Puricii cruciferelor",
      "Gărgărița florii-soarelui",
      "Gândaci care atacă florile",
    ],

    advantages: [
      "Acțiune rapidă și perioadă lungă de protecție",
      "Două substanțe active din grupe diferite (avermectine și piretroizi), pentru o combatere mai completă",
      "Acționează și asupra ouălor omizilor de fluturi",
      "Acțiune translaminară, de contact și prin ingestie, cu efect de respingere",
      "Compatibil cu majoritatea insecticidelor, fungicidelor și erbicidelor",
      "Nu este fitotoxic la dozele și în perioadele recomandate",
    ],

    usageTargetLabel: "Dăunători combătuți",
    usage: [
      { cultura: "Măr", boli: "Viermele mărului", doza: "0,5–0,6 kg/ha", perioada: "Prin stropire, în perioada de vegetație", tratamente: "1", pauza: "20 zile" },
      { cultura: "Viță-de-vie", boli: "–", doza: "0,4–0,5 kg/ha", perioada: "Prin stropire, în perioada de vegetație", tratamente: "1–2", pauza: "30 zile" },
      { cultura: "Floarea-soarelui", boli: "Buha fructificațiilor, fluturele de pajiște, afide, molii, gărgărița florii-soarelui", doza: "0,4–0,6 kg/ha", apa: "200–300 l/ha", perioada: "Prin stropire, în perioada de vegetație" },
      { cultura: "Rapiță", boli: "Molia verzei, puricii cruciferelor, buhe, afide, gândaci care atacă florile", doza: "0,4–0,6 kg/ha", apa: "200–300 l/ha", perioada: "Prin stropire, în perioada de vegetație" },
    ],
    usageNote: "Pentru suprafețe mici: 0,5 kg/ha înseamnă 5 g la 100 m². Se folosesc pulverizatoare care distribuie uniform soluția; în livezi și vii, cantitatea de soluție este de 800–1000 l/ha. Se folosește numai la culturile pentru care este înregistrat. Lucrările manuale pe suprafața tratată se pot relua după 3 zile. Înainte de utilizare, citiți eticheta și respectați reglementările în vigoare.",

    stepsTitle: "Măsuri de siguranță",
    steps: [
      "Lucrați numai cu echipament individual de protecție și nu stropiți când bate vântul puternic.",
      "Evitați inhalarea produsului și contactul cu pielea neprotejată.",
      "Păstrați produsul într-un depozit aerisit, ferit de umezeală.",
    ],
    stepsAfter: [
      "Dacă produsul ajunge pe piele, scoateți hainele contaminate și spălați pielea cu apă și săpun. Dacă ajunge în ochi, clătiți din abundență cu apă.",
      "În caz de intoxicație, scoateți persoana din zona de lucru și adresați-vă imediat medicului.",
      "Produsul este toxic pentru pești: nu-l lăsați să ajungă în ape.",
    ],

    specs: [
      { k: "Brand", v: "Chimagro Marketing" },
      { k: "Denumire", v: "Prokka WP" },
      { k: "Tip", v: "Insecticid translaminar și de contact" },
      { k: "Substanțe active", v: "Emamectin benzoat 35 g/kg; lambda-cihalotrin 50 g/kg" },
      { k: "Grupe chimice", v: "Avermectine; piretroizi sintetici" },
      { k: "Formulare", v: "WP – pulbere umectabilă" },
      { k: "Culturi", v: "Măr, viță-de-vie, floarea-soarelui, rapiță" },
      { k: "Clasa de toxicitate", v: "III (moderat periculos)" },
      { k: "Reintrarea pe suprafața tratată", v: "După 3 zile" },
      { k: "Ambalaj", v: "1 kg" },
      { k: "Suprafață tratată cu 1 kg (la 0,5 kg/ha)", v: "Circa 2 ha" },
    ],
    // flyer: "/flyere/produs26.pdf",
  },
  27: {
    name: "Accelerator NPK – îngrășământ foliar cu microelemente chelatate",
    // origin: { country: "Moldova", code: "md" }, // completează țara de fabricație, dacă o știi
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Îngrășământ foliar complex NPK cu microelemente chelatate (EDTA), care se absorb foarte repede. Pentru pomi, viță-de-vie, legume și culturi de câmp.",
    // --- pagina de detalii ---
    intro: "Accelerator NPK este un îngrășământ complex pentru aplicare pe frunze, sub formă de pulbere cristalină, cu macroelemente și microelemente chelatate cu EDTA. Datorită agentului de chelare, elementele nutritive sunt transformate în compuși pe care planta îi absoarbe într-un timp foarte scurt și cu un consum minim de energie. Corectează nutriția minerală în condiții nefavorabile, stimulează dezvoltarea rădăcinilor, are efect biostimulator și ajută plantele să treacă mai ușor peste stresul produs de tratamentele cu pesticide.",
    features: ["Aplicare pe frunze", "Microelemente chelatate (EDTA)", "Absorbție rapidă", "Ambalaj 1 kg"],
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p27-hero se vede

    advantages: [
      "Corectează nutriția minerală a plantelor în condiții nefavorabile",
      "Stimulează dezvoltarea sistemului radicular și are acțiune biostimulatoare",
      "Crește absorbția nutrienților, care sunt asimilați foarte repede datorită chelării cu EDTA",
      "Reduce stresul plantelor după tratamentele cu pesticide",
      "Crește recolta și calitatea ei: conținutul de zahăr, amidon, substanță uscată, proteine și ulei",
      "Grăbește coacerea și reduce acumularea de nitrați în produse",
      "Se poate aplica împreună cu pesticide, stimulatori de creștere și alte îngrășăminte",
    ],

    usage: [
      { cultura: "Măr", perioada: "Primul tratament la faza de „buton roz”, al doilea în perioada de creștere intensă a fructelor", doza: "2,0 + 2,0 kg/ha", apa: "800 l/ha", tratamente: "2" },
      { cultura: "Pomi fructiferi și viță-de-vie", perioada: "Înainte de înflorire și în perioada de fructificare", doza: "1,5–3,0 kg/ha" },
      { cultura: "Grâu de toamnă", perioada: "Înainte de intrarea în iarnă", doza: "1,0–2,0 kg/ha" },
      { cultura: "Floarea-soarelui", perioada: "Înainte de formarea butonilor florali", doza: "1,0–2,0 kg/ha" },
      { cultura: "Rapiță", perioada: "De la alungirea tulpinii până la formarea butonilor florali", doza: "1,0–2,0 kg/ha" },
      { cultura: "Sfeclă de zahăr", perioada: "Cu 3–4 săptămâni înainte de recoltare", doza: "0,5–2,0 kg/ha" },
      { cultura: "Ceapă", perioada: "La formarea bulbului", doza: "1,0–2,0 kg/ha" },
      { cultura: "Cucurbitacee (castraveți, dovleci, pepeni)", perioada: "La formarea butonilor florali", doza: "1,0–2,0 kg/ha" },
    ],
    usageNote: "Se aplică prin stropire pe frunze, cu distribuirea uniformă a soluției. Pentru suprafețe mici: 1 kg/ha înseamnă 10 g la 100 m². Nu stropiți când vântul depășește 4–5 m/s. Nu amestecați cu produse care conțin cupru, aluminiu sau alte metale. Înainte de a-l amesteca cu pesticide sau alte produse, faceți un test într-un vas mic, ca să vă asigurați că nu se formează depuneri. Respectând recomandările, produsul nu este fitotoxic.",

    stepsTitle: "Măsuri de siguranță",
    steps: [
      "Lucrați cu îmbrăcăminte de protecție, mănuși și ochelari și evitați inhalarea produsului și contactul cu ochii și pielea.",
      "Nu mâncați, nu beți și nu fumați în timpul lucrului. După lucru, scoateți echipamentul de protecție și spălați-vă bine pe mâini.",
      "Păstrați produsul în ambalajul original, bine închis, într-o încăpere uscată, răcoroasă și aerisită, la temperaturi între −5°C și +35°C, departe de copii și de alimente.",
    ],
    stepsAfter: [
      "Dacă produsul ajunge pe piele, scoateți hainele și spălați pielea cu apă și săpun. Dacă ajunge în ochi, clătiți din abundență cu apă. În caz de intoxicație, adresați-vă medicului.",
      "Nu lăsați produsul sau ambalajul să ajungă în ape și nu refolosiți ambalajul gol.",
    ],

    specs: [
      { k: "Brand", v: "Chimagro Marketing" },
      { k: "Denumire", v: "Accelerator NPK" },
      { k: "Tip", v: "Îngrășământ complex pentru aplicare foliară" },
      { k: "Macroelemente", v: "N 18%, P₂O₅ 18%, K₂O 18%, SO₃ 2%" },
      { k: "Microelemente", v: "Fier (Fe) 0,07%, mangan (Mn) 0,04%, bor (B) 0,025%, zinc (Zn) 0,025%, cupru (Cu) 0,01%, molibden (Mo) 0,004%" },
      { k: "Agent de chelare", v: "EDTA (acid etilendiaminotetraacetic)" },
      { k: "Formă", v: "Pulbere cristalină" },
      { k: "Cantitate de soluție", v: "800 l/ha" },
      { k: "Ambalaj", v: "1 kg" },
      { k: "Valabilitate", v: "3 ani" },
    ],
    // flyer: "/flyere/produs27.pdf",
  },
  28: {
    name: "Universal TIO 82,5 WP – fungicid cu tebuconazol și sulf",
    // origin: { country: "Moldova", code: "md" }, // completează țara de fabricație, dacă o știi
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Fungicid sistemic, de contact și de fumigație, cu tebuconazol și sulf, pentru grâu, orz, rapiță și ceapă. Acționează în 2–3 ore și are și efect asupra acarienilor.",
    // --- pagina de detalii ---
    intro: "Universal TIO 82,5 WP este un fungicid sistemic, de contact și de fumigație, sub formă de pulbere umectabilă, cu două substanțe active. Tebuconazolul, cea mai activă substanță din grupa triazolilor, pătrunde în plantă, are efect protector și curativ și începe să acționeze la 2–3 ore după tratament. Sulful acționează imediat, prin contact, aderă bine pe plante, iar vaporii lui pătrund în celulele agenților patogeni și le opresc dezvoltarea. Compușii sulfului din faza de vapori au și efect acaricid. Produsul este omologat în Republica Moldova.",
    features: ["Sistemic, de contact și de fumigație", "Acționează în 2–3 ore", "Efect și asupra acarienilor", "Ambalaj 1 kg"],
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p28-hero se vede

    applicationsTitle: "Boli combătute",
    applicationsNoIcon: true, // fără romburile din fața fiecărui rând
    applications: [
      "Făinarea",
      "Rugina brună și rugina pitică",
      "Septorioza",
      "Helmintosporiozele",
      "Rincosporioza",
      "Pătarea dungată și pătarea reticulară a orzului",
      "Alternarioza",
      "Fomoza",
      "Putregaiul alb și alte putregaiuri",
      "Rugina cepei",
    ],

    advantages: [
      "Trei moduri de acțiune: sistemic (tebuconazol), de contact și de fumigație (sulf)",
      "Efect protector și curativ",
      "Tebuconazolul începe să acționeze la 2–3 ore de la tratament, iar sulful acționează imediat la contact",
      "Sulful aderă bine pe plante, iar vaporii lui au și efect asupra acarienilor",
      "Combate cele mai importante boli ale cerealelor, rapiței și cepei",
      "Compatibil cu majoritatea insecticidelor și fungicidelor",
      "Nu este fitotoxic dacă se respectă recomandările de utilizare",
      "Omologat în Republica Moldova",
    ],

    usageTargetLabel: "Boli combătute",
    usage: [
      { cultura: "Grâu", boli: "Făinarea, rugina brună, septorioza, helmintosporiozele", doza: "1,5–2,0 kg/ha", perioada: "Prin stropire, în perioada de vegetație", tratamente: "2", pauza: "28 zile" },
      { cultura: "Orz de toamnă și de primăvară", boli: "Rugina pitică, făinarea, rincosporioza, pătarea dungată și pătarea reticulară", doza: "1,0–1,5 kg/ha", apa: "250–350 l/ha", perioada: "Prin stropire, în perioada de vegetație" },
      { cultura: "Rapiță de toamnă", boli: "Alternarioza, fomoza, putregaiul alb", doza: "1,5–2,0 kg/ha", perioada: "Toamna, la 4–6 frunze, și primăvara, până la începutul formării butonilor florali", tratamente: "1–2", pauza: "28 zile" },
      { cultura: "Ceapă", boli: "Rugina, putregaiurile, făinarea", doza: "1,0–1,4 kg/ha", apa: "250–350 l/ha", perioada: "Prin stropire, în perioada de vegetație" },
    ],
    usageNote: "Pentru suprafețe mici: 1 kg/ha înseamnă 10 g la 100 m². Lucrările manuale sau mecanizate pe suprafața tratată se pot relua după 3 zile. „Nr. max. tratamente” înseamnă numărul maxim de tratamente pe sezon. Este interzisă folosirea produsului în zonele de protecție a râurilor și a bazinelor de apă. Înainte de utilizare, citiți eticheta și respectați reglementările în vigoare.",

    stepsTitle: "Măsuri de siguranță",
    steps: [
      "Nu lucrați cu produsul dacă aveți sub 18 ani sau sunteți însărcinată.",
      "Purtați îmbrăcăminte de protecție, mănuși și ochelari și evitați inhalarea produsului și contactul cu ochii și pielea. Nu mâncați, nu beți și nu fumați în timpul lucrului.",
      "După lucru, scoateți echipamentul de protecție și spălați-vă bine cu apă caldă și săpun. Spălați îmbrăcămintea de lucru separat.",
    ],
    stepsAfter: [
      "Dacă produsul ajunge pe piele, scoateți hainele și spălați pielea cu apă și săpun. Dacă ajunge în ochi, clătiți din abundență cu apă. În caz de intoxicație, adresați-vă medicului.",
      "Păstrați produsul în ambalajul original, bine închis, într-o încăpere uscată, răcoroasă și aerisită, la temperaturi între −5°C și +35°C, departe de copii, de alimente și de furaje.",
      "Nu lăsați produsul sau ambalajul să ajungă în ape și nu refolosiți ambalajul gol.",
    ],

    specs: [
      { k: "Brand", v: "Chimagro Marketing" },
      { k: "Denumire", v: "Universal TIO 82,5 WP" },
      { k: "Tip", v: "Fungicid sistemic, de contact și de fumigație" },
      { k: "Substanțe active", v: "Tebuconazol 125 g/kg; sulf 700 g/kg" },
      { k: "Grupe chimice", v: "Triazoli; compuși anorganici" },
      { k: "Formulare", v: "WP – pulbere umectabilă" },
      { k: "Culturi", v: "Grâu, orz, rapiță de toamnă, ceapă" },
      { k: "Clasa de toxicitate (om / albine)", v: "III / IV" },
      { k: "Certificat de omologare (Republica Moldova)", v: "Nr. 24-08-08-02-1665 din 08.08.2024, pe 7 ani" },
      { k: "Ambalaj", v: "1 kg" },
      { k: "Suprafață tratată cu 1 kg (la 1,5 kg/ha)", v: "Circa 6.600 m²" },
    ],
    // flyer: "/flyere/produs28.pdf",
  },
  29: {
    name: "Abaco 18 EC – insectoacaricid de origine biologică",
    // origin: { country: "Moldova", code: "md" }, // completează țara de fabricație, dacă o știi
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Insectoacaricid cu abamectină, de origine biologică, împotriva acarienilor (păianjenilor), a minierilor, a tripșilor și a altor dăunători, la plantele de grădină și de interior.",
    // --- pagina de detalii ---
    intro: "Abaco 18 EC este un insectoacaricid nesistemic de origine biologică, cu acțiune de contact și prin ingestie, sub formă de concentrat emulsionabil. Protejează culturile de grădină și plantele de interior de acarieni (păianjeni), insecte miniere, tripși și alți dăunători. Substanța activă, abamectina, este un produs natural obținut prin fermentarea unei bacterii din sol (Streptomyces avermitilis). Ea blochează transmiterea impulsurilor nervoase și paralizează insectele și acarienii: acarienii devin inactivi la o zi după stropire și mor complet în 2–3 zile. Ajută și la combaterea dăunătorilor care au devenit rezistenți la alte substanțe active.",
    features: ["Origine biologică", "Pentru plante de grădină și de interior", "Contra acarienilor și tripșilor", "Flacon 1 L"],
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p29-hero se vede

    applicationsTitle: "Dăunători combătuți",
    applicationsNoIcon: true, // fără romburile din fața fiecărui rând
    applications: [
      "Acarienii (păianjenii)",
      "Insectele miniere (minierii frunzelor)",
      "Tripșii",
      "Alți dăunători ai culturilor de grădină și ai plantelor de interior",
    ],

    advantages: [
      "Substanță activă de origine biologică, obținută prin fermentarea unei bacterii din sol",
      "Combate atât insectele, cât și acarienii",
      "Potrivit pentru culturile de grădină și pentru plantele de interior",
      "Acarienii devin inactivi la o zi după stropire și mor complet în 2–3 zile",
      "Ajută la combaterea dăunătorilor rezistenți la alte clase de substanțe active",
      "Compatibil cu numeroase insecticide și fungicide",
      "Nu este fitotoxic la dozele recomandate",
    ],

    stepsTitle: "Prepararea soluției",
    steps: [
      "Umpleți rezervorul pulverizatorului cu apă până la o treime și porniți agitatorul.",
      "Adăugați cantitatea de produs calculată și măsurată, apoi completați cu restul de apă.",
      "Folosiți soluția în ziua în care ați pregătit-o și nu o păstrați în rezervor mai mult de 24 de ore. Nu stropiți pe vânt.",
    ],
    stepsAfter: [
      "Nu amestecați cu fungicide pe bază de cupru sau cu produse puternic alcaline. Înainte de a-l amesteca cu alte produse, faceți un test de compatibilitate.",
      "Pentru a evita apariția rezistenței, îl puteți aplica în amestec cu insecticide din alte grupe chimice.",
      "Pentru a proteja albinele, nu stropiți plantele în timpul înfloririi și nu folosiți produsul în sezonul de activitate al albinelor.",
      "Produsul este foarte toxic pentru organismele acvatice: nu-l aplicați lângă cursuri de apă și nu lăsați să ajungă în ape sau în canalizare.",
      "Evitați inhalarea și contactul cu ochii și pielea și nu mâncați, nu beți și nu fumați în timpul lucrului. Dacă ajunge în ochi sau pe piele, clătiți cu multă apă. În caz de înghițire, clătiți gura, nu provocați voma și adresați-vă medicului.",
      "Păstrați produsul la −5…+25°C, în ambalajul original, bine închis, departe de copii, de animale și de alimente. Clătiți de trei ori ambalajul gol și turnați apa în rezervor.",
    ],

    specs: [
      { k: "Denumire", v: "Abaco 18 EC" },
      { k: "Tip", v: "Insectoacaricid nesistemic, de origine biologică" },
      { k: "Substanță activă", v: "Abamectină 18 g/l (grupa avermectinelor)" },
      { k: "Formulare", v: "EC – concentrat emulsionabil" },
      { k: "Mod de acțiune", v: "Contact și ingestie" },
      { k: "Utilizare", v: "Culturi de grădină și plante de interior" },
      { k: "Păstrare", v: "−5…+25°C, în ambalajul original" },
      { k: "Certificat de omologare (Republica Moldova)", v: "Nr. 22-03-03-01-1043" },
      { k: "Ambalaj", v: "1 L" },
    ],
    // flyer: "/flyere/produs29.pdf",
  },
  30: {
    name: "Heksoran SC – acaricid cu efect de lungă durată",
    // origin: { country: "Moldova", code: "md" }, // completează țara de fabricație, dacă o știi
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Acaricid cu hexitiazox, de contact și prin ingestie, cu efect translaminar și de lungă durată, împotriva celor mai răspândite specii de acarieni.",
    // --- pagina de detalii ---
    intro: "Heksoran SC este un acaricid de contact și prin ingestie, împotriva celor mai răspândite specii de acarieni, cu efect de lungă durată și acțiune translaminară. Substanța activă, hexitiazoxul, face parte din grupa inhibitorilor de creștere a acarienilor: oprește dezvoltarea acarienilor de la stadiul de ou până la cel de nimfă. Datorită efectului translaminar, combate acarienii și în locurile greu accesibile, unde soluția nu a ajuns direct.",
    features: ["Acaricid", "Acționează pe ouă și larve", "Efect translaminar", "Flacon 1 L"],
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p30-hero se vede

    advantages: [
      "Combate cele mai răspândite specii de acarieni",
      "Oprește dezvoltarea acarienilor de la ou până la nimfă",
      "Efect de lungă durată",
      "Acțiune translaminară: ajunge și la acarienii din locurile greu accesibile",
      "Acționează prin contact și prin ingestie",
      "Compatibil cu majoritatea insecticidelor, fungicidelor și erbicidelor",
      "Nu este fitotoxic dacă se respectă recomandările de utilizare",
    ],

    usageTargetLabel: "Dăunător combătut",
    usage: [
      { cultura: "Soia", boli: "Acarianul roșu comun (Tetranychus urticae)", doza: "0,1–0,15 l/ha", apa: "200 l/ha", perioada: "Prin stropire, în perioada de vegetație", tratamente: "1–2", pauza: "35 zile" },
    ],
    usageNote: "Pentru suprafețe mici: 0,1–0,15 l/ha înseamnă 1–1,5 ml la 100 m². Lucrările manuale sau mecanizate pe suprafața tratată se pot relua după 3 zile. Înainte de utilizare, citiți eticheta și respectați reglementările în vigoare.",

    stepsTitle: "Măsuri de siguranță",
    steps: [
      "Nu lucrați cu produsul dacă aveți sub 18 ani sau sunteți însărcinată.",
      "Purtați îmbrăcăminte de protecție, mănuși și ochelari și evitați inhalarea produsului și contactul cu ochii și pielea. Nu mâncați, nu beți și nu fumați în timpul lucrului.",
      "După lucru, scoateți echipamentul de protecție și spălați-vă bine cu apă caldă și săpun. Spălați îmbrăcămintea de lucru separat.",
    ],
    stepsAfter: [
      "Dacă produsul ajunge pe piele, scoateți hainele și spălați pielea cu apă și săpun. Dacă ajunge în ochi, clătiți din abundență cu apă. În caz de intoxicație, adresați-vă medicului.",
      "Păstrați produsul în ambalajul original, bine închis, într-o încăpere uscată, răcoroasă și aerisită, la temperaturi între −5°C și +35°C, departe de copii, de alimente și de furaje.",
      "Nu lăsați produsul sau ambalajul să ajungă în ape și nu refolosiți ambalajul gol.",
    ],

    specs: [
      { k: "Brand", v: "Chimagro Marketing" },
      { k: "Denumire", v: "Heksoran SC" },
      { k: "Tip", v: "Acaricid de contact și prin ingestie, translaminar" },
      { k: "Substanță activă", v: "Hexitiazox 450 g/l" },
      { k: "Grupa chimică", v: "Carboxamide" },
      { k: "Formulare", v: "SC – suspensie concentrată" },
      { k: "Clasa de toxicitate (om / albine)", v: "III / IV" },
      { k: "Ambalaj", v: "1 L" },
      { k: "Suprafață tratată cu 1 L (la 0,15 l/ha)", v: "Circa 6,6 ha" },
      { k: "Valabilitate", v: "3 ani" },
    ],
    // flyer: "/flyere/produs30.pdf",
  },
  31: {
    name: "Brodvei SC – fungicid pentru viță-de-vie",
    // origin: { country: "Moldova", code: "md" }, // completează țara de fabricație, dacă o știi
    fit: "contain", // șterge dacă poza trebuie să umple cardul (fundal ne-alb)
    desc: "Fungicid cu azoxistrobin, cu acțiune preventivă, curativă și de eradicare, care protejează vița-de-vie de mană, făinare și putregaiul cenușiu.",
    // --- pagina de detalii ---
    intro: "Brodvei SC este un fungicid cu acțiune preventivă, curativă și de eradicare, care protejează vița-de-vie de mană, făinare (oidiu) și putregaiul cenușiu. Substanța activă, azoxistrobinul, din grupa strobilurinelor, acționează aproape imediat: împiedică germinarea sporilor pe suprafața frunzelor, distruge în câteva ore ciuperca din interiorul frunzei și oprește formarea de noi spori. Este cel mai eficient în primele stadii ale infecției și protejează plantele 1–2 săptămâni, în funcție de presiunea bolii, de vreme și de practicile agricole.",
    features: ["Preventiv, curativ și eradicant", "Acțiune aproape imediată", "Protecție 1–2 săptămâni", "Flacon 1 L"],
    heroFit: "contain", // poza de hero e pe fundal alb -> se vede ÎNTREAGĂ (nu zoomată)
    // heroPos: "50% 30%", // opțional: ce parte din poza p31-hero se vede

    applicationsTitle: "Boli combătute",
    applicationsNoIcon: true, // fără romburile din fața fiecărui rând
    applications: [
      "Mana viței-de-vie",
      "Făinarea (oidiul)",
      "Putregaiul cenușiu",
    ],

    advantages: [
      "Acțiune preventivă, curativă și de eradicare",
      "Acționează aproape imediat: împiedică germinarea sporilor și distruge ciuperca din frunză în câteva ore",
      "Eficient și împotriva ciupercilor rezistente la fenilamide, benzimidazoli și inhibitori ai sintezei sterolilor",
      "Întărește și prelungește fotosinteza",
      "Analog al unui compus natural, cu caracteristici foarte bune față de mediu",
      "Compatibil cu multe fungicide, insecticide și acaricide",
      "Nu este fitotoxic la dozele recomandate",
    ],

    usageTargetLabel: "Boli combătute",
    usage: [
      { cultura: "Viță-de-vie", boli: "Mana, făinarea", doza: "0,6–0,8 l/ha (25 ml la 20–25 l apă)", perioada: "Prin stropire, în perioada de vegetație, dimineața sau seara, fără vânt", tratamente: "2", pauza: "25 zile" },
    ],
    usageNote: "Cel mai bun efect se obține la aplicarea în primele stadii ale infecției. Lucrările manuale pe suprafața tratată se pot relua după 7 zile, iar cele mecanizate după 3 zile. Se folosește numai la culturile pentru care este înregistrat și este interzis în zonele de protecție a râurilor și a bazinelor de apă. Înainte de utilizare, citiți eticheta și respectați reglementările în vigoare.",

    stepsTitle: "Măsuri de siguranță",
    steps: [
      "Purtați îmbrăcăminte de protecție, mănuși și ochelari și evitați inhalarea produsului și contactul cu ochii și pielea.",
      "Stropiți dimineața sau seara, când nu bate vântul.",
      "Păstrați produsul în ambalajul original, bine închis, într-o încăpere uscată, răcoroasă și aerisită, la temperaturi între −5°C și +35°C, departe de copii, de alimente și de furaje.",
    ],
    stepsAfter: [
      "Dacă produsul ajunge pe piele, scoateți hainele și spălați pielea cu apă și săpun. Dacă ajunge în ochi, clătiți din abundență cu apă. În caz de intoxicație, adresați-vă medicului.",
      "Nu lăsați produsul sau ambalajul să ajungă în ape și nu refolosiți ambalajul gol.",
    ],

    specs: [
      { k: "Brand", v: "Chimagro Marketing" },
      { k: "Denumire", v: "Brodvei SC" },
      { k: "Tip", v: "Fungicid preventiv, curativ și eradicant" },
      { k: "Substanță activă", v: "Azoxistrobin 250 g/l" },
      { k: "Grupa chimică", v: "Strobilurine" },
      { k: "Formulare", v: "SC – suspensie concentrată" },
      { k: "Cultură", v: "Viță-de-vie" },
      { k: "Perioadă de protecție", v: "1–2 săptămâni" },
      { k: "Ambalaj", v: "1 L" },
      { k: "Suprafață tratată cu 1 L (la 0,8 l/ha)", v: "Circa 1,25 ha" },
      { k: "Valabilitate", v: "3 ani" },
    ],
    // flyer: "/flyere/produs31.pdf",
  },
};

/* Imagini + VIDEO pentru PAGINA de produs - se încarcă tot automat din:
     src/assets/produse/detalii/
   Convenție de nume (N = numărul produsului):
     - hero mare:       p1-hero.jpg
     - slideshow:       p1-slide1.jpg, p1-slide2.jpg ...  (poți pune și
                        p1-slide3.mp4 - un slide poate fi VIDEO)
     - galerie (jos):   p1-1.jpg, p1-2.jpg ...
   Video acceptat: .mp4, .webm  (autoplay, fără sunet, în buclă). */
const detailImages = import.meta.glob(
  "./assets/produse/detalii/*.{jpg,jpeg,png,webp,mp4,webm}",
  { eager: true, import: "default" }
);

function detailFor(num) {
  const entries = Object.entries(detailImages);
  const numFrom = (s) => parseInt(s.match(/-(?:slide)?(\d+)\./)?.[1] ?? "0", 10);
  const isVideo = (p) => /\.(mp4|webm)$/i.test(p);

  const heroImg = entries.find(([path]) =>
    new RegExp(`/p${num}-hero\\.`, "i").test(path)
  )?.[1];

  const slides = entries
    .filter(([path]) => new RegExp(`/p${num}-slide(\\d+)\\.`, "i").test(path))
    .map(([path, src]) => ({ n: numFrom(path), src, video: isVideo(path) }));

  const gallery = entries
    .filter(([path]) => new RegExp(`/p${num}-(\\d+)\\.`, "i").test(path) && !isVideo(path))
    .sort(([a], [b]) => numFrom(a) - numFrom(b))
    .map(([, src]) => src);

  return { heroImg, slides, gallery };
}

/* Extrage ID-ul și timpul de start dintr-un link YouTube. */
function parseYouTube(url) {
  const id = String(url).match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1] || "";
  const start = String(url).match(/[?&#]t=(\d+)/)?.[1];
  return { youtube: id, start: start ? Number(start) : undefined };
}

const PRODUCTS = Object.entries(productImages)
  .map(([path, img]) => {
    const num = parseInt(path.match(/produs(\d+)/i)?.[1] ?? "0", 10);
    const info = PRODUCT_INFO[num] || {};
    const detail = detailFor(num);
    // combină slide-urile din fișiere cu cele YouTube (info.youtube = { nrSlide: url })
    const ytSlides = Object.entries(info.youtube || {}).map(([n, url]) => ({
      n: Number(n),
      ...parseYouTube(url),
    }));
    const slides = [...detail.slides, ...ytSlides].sort((a, b) => a.n - b.n);
    return { num, img, ...detail, ...info, slides };
  })
  .sort((a, b) => a.num - b.num);

/* Carduri DEMO - se afișează cât timp încă nu ai pus produse reale în
   src/assets/produse/. Când adaugi primul produs, ele dispar automat. */
const DEMO_PRODUCTS = [
  { num: 1, name: "Folii biodegradabile", desc: "Folie alb-negru pentru prevenirea creșterii nedorite a rădăcinilor și a algelor, protejând și prelungind durata de viață a jgheaburilor de cultură." },
  { num: 2, name: "Folii anti-condens", desc: "Economisește energie și creează un climat optim în seră." },
  { num: 3, name: "Folii transparente pentru seră", desc: "Protejează cultura și stimulează creșterea plantelor." },
];

/* ============================================================
   CATEGORII - grupează produsele pe secțiuni în catalog.
   ------------------------------------------------------------
   „nums" = numerele produselor (după numele pozei: produs3 -> 3)
   care apar în categoria respectivă, ÎN ORDINEA dorită.
   - Muți un produs în altă categorie -> îi muți numărul.
   - Schimbi ordinea într-o categorie -> rearanjezi numerele.
   - O categorie fără niciun produs disponibil nu se afișează.
   ============================================================ */
const CATEGORIES = [
  { title: "Folii și plase pentru plante", nums: [1, 2] },
  { title: "Ventilatoare și pulverizatoare pentru seră", nums: [8, 3, 5, 4], cols: 2 },
  { title: "Tăvi de irigare și lădițe", nums: [6, 7, 9] },
  { title: "Nutriția plantelor", nums: [12, 23, 25, 24, 27, 14, 16, 22, 17, 20] }, // adaugă aici numerele produselor de nutriție
  { title: "Protecția plantelor", nums: [10, 11, 13, 18, 29, 30, 19, 31, 21, 26, 28, 15] },
];

export default function App() {
  const [active, setActive] = useState(0);
  const [openProduct, setOpenProduct] = useState(null);
  const [lang, setLangState] = useState("ro");

  useEffect(() => {
    if (SLIDES.length <= 1) return; // nimic de rotit dacă e 0 sau 1 imagine
    const t = setInterval(() => setActive((p) => (p + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  // ---- COMUTATOR DE LIMBĂ (Google Translate, ascuns) ----
  useEffect(() => {
    // citește limba curentă din cookie
    const m = document.cookie.match(/googtrans=\/[^/]+\/(\w+)/);
    if (m) setLangState(m[1]);

    // încarcă o singură dată widgetul Google Translate (ascuns)
    if (!document.getElementById("google-translate-script")) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: "ro", includedLanguages: "ro,ru,en", autoDisplay: false },
          "google_translate_element"
        );
      };
      const s = document.createElement("script");
      s.id = "google-translate-script";
      s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(s);
    }

    // ține bara Google Translate ascunsă și pagina la locul ei
    const hideBanner = () => {
      const banner = document.querySelector(".goog-te-banner-frame, iframe.skiptranslate");
      if (banner) banner.style.display = "none";
      if (document.body.style.top && document.body.style.top !== "0px") {
        document.body.style.top = "0px";
      }
    };
    const iv = setInterval(hideBanner, 250);
    const stop = setTimeout(() => clearInterval(iv), 8000);
    return () => { clearInterval(iv); clearTimeout(stop); };
  }, []);

  const changeLang = (l) => {
    if (l === lang) return;
    const host = window.location.hostname;
    const expired = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
    if (l === "ro") {
      // revenim la textul original (română): ștergem cookie-ul
      document.cookie = `googtrans=;${expired};path=/;`;
      document.cookie = `googtrans=;${expired};path=/;domain=.${host};`;
    } else {
      document.cookie = `googtrans=/ro/${l};path=/;`;
      document.cookie = `googtrans=/ro/${l};path=/;domain=.${host};`;
    }
    // ține minte pe ce produs eram, ca să revenim tot acolo după reîncărcare
    if (openProduct) sessionStorage.setItem("hosmanOpenProduct", String(openProduct.num));
    else sessionStorage.removeItem("hosmanOpenProduct");
    window.location.reload();
  };

  // după schimbarea limbii (reîncărcare), redeschide produsul unde eram
  useEffect(() => {
    const saved = sessionStorage.getItem("hosmanOpenProduct");
    if (saved) {
      sessionStorage.removeItem("hosmanOpenProduct");
      const src = PRODUCTS.length > 0 ? PRODUCTS : DEMO_PRODUCTS;
      const p = src.find((x) => x.num === Number(saved));
      if (p) {
        setOpenProduct(p);
      }
    }
  }, []);

  const goTo = (i) =>
    SLIDES.length > 0 && setActive((i + SLIDES.length) % SLIDES.length);

  const openProductPage = (p) => {
    setOpenProduct(p);
  };

  // de fiecare dată când se deschide un produs, pagina începe de sus
  useLayoutEffect(() => {
    if (!openProduct) return;
    jumpTo(0);
    // încă o dată după ce se încarcă pozele / traducerea, pentru siguranță
    const t1 = setTimeout(() => jumpTo(0), 60);
    return () => clearTimeout(t1);
  }, [openProduct]);

  // browserul să nu „țină minte” poziția veche la reîncărcare
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  }, []);
  const closeProductPage = () => {
    setOpenProduct(null);
    // după ce revine pagina principală, derulăm la secțiunea catalog
    requestAnimationFrame(() => {
      const el = document.getElementById("catalog");
      if (el) jumpTo(el.getBoundingClientRect().top + window.scrollY);
      else jumpTo(0);
    });
  };

  // Dacă un produs e deschis, afișăm pagina lui în locul paginii principale.
  if (openProduct) {
    return (
      <>
        <ProductPage product={openProduct} onBack={closeProductPage} lang={lang} onChangeLang={changeLang} />
        <ContactButton />
      </>
    );
  }

  return (
    <>
    <div className="hosman" id="acasa">
      {/* element ascuns pentru Google Translate */}
      <div id="google_translate_element" style={{ display: "none" }} />

      {/* CADRU VERDE SUS: header + hero */}
      <div className="topwrap">
        <header className="site-header">
          <img
            className="brand-logo"
            src="/logo.png"
            alt="Hosman Accessories"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <span className="brand-script notranslate" translate="no">Hosman Accessories</span>

          <div className="lang-switch notranslate" translate="no">
            <button
              className={`lang-btn${lang === "ro" ? " active" : ""}`}
              onClick={() => changeLang("ro")}
            >
              RO
            </button>
            <button
              className={`lang-btn${lang === "ru" ? " active" : ""}`}
              onClick={() => changeLang("ru")}
            >
              RU
            </button>
            <button
              className={`lang-btn${lang === "en" ? " active" : ""}`}
              onClick={() => changeLang("en")}
            >
              EN
            </button>
          </div>
        </header>

        {/* HERO - slider de imagini */}
        <section className="hero">
          <div className="hero-slides">
            {SLIDES.map((s, idx) => (
              <div
                key={s.num}
                className={`hero-slide ${idx === active ? "active" : ""}`}
                style={{ backgroundImage: `url('${s.img}')` }}
              />
            ))}
          </div>
          <div className="hero-overlay" />

          {SLIDES.length > 1 && (
            <>
              <button className="hero-arrow left" aria-label="Imaginea anterioară" onClick={() => goTo(active - 1)}>
                <ChevronLeft size={22} />
              </button>
              <button className="hero-arrow right" aria-label="Imaginea următoare" onClick={() => goTo(active + 1)}>
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <div className="hero-inner">
            <p className="hero-sub">
              Soluții complete pentru horticultură: de la substraturi și accesorii
              pentru sere până la produse pentru nutriția și protecția plantelor.
            </p>
            <a href="#catalog" className="hero-btn">Vezi catalogul</a>
          </div>

          {SLIDES.length > 1 && (
            <div className="hero-dots">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  className={idx === active ? "active" : ""}
                  aria-label={`Imaginea ${idx + 1}`}
                  onClick={() => goTo(idx)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* COLABORATORI - bandă în mișcare continuă */}
      {PARTNERS.length > 0 && (
        <section className="partners" id="colaboratori">
          <div className="h-wrap">
            <h2 className="partners-title">Lucrăm cu parteneri de încredere</h2>
          </div>

          <div className="marquee">
            <div className="marquee-track">
              {[...PARTNERS, ...PARTNERS].map((p, i) => {
                const logo = (
                  <img className="partner-logo" src={p.src} alt={`Partener ${p.num}`} />
                );
                return p.url ? (
                  <a
                    key={i}
                    className="partner"
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Partener ${p.num}`}
                  >
                    {logo}
                  </a>
                ) : (
                  <div key={i} className="partner" aria-label={`Partener ${p.num}`}>
                    {logo}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CATALOG pe categorii */}
      <section className="catalog" id="catalog">
        <div className="h-wrap">
          {CATEGORIES.map((cat) => {
            const list = PRODUCTS.length > 0 ? PRODUCTS : DEMO_PRODUCTS;
            const items = cat.nums
              .map((n) => list.find((p) => p.num === n))
              .filter(Boolean);
            if (items.length === 0) return null;
            const gridClass =
              cat.cols === 2
                ? "catalog-grid catalog-grid--2col"
                : items.length < 3
                ? "catalog-grid catalog-grid--center"
                : "catalog-grid";
            return (
              <div className="catalog-cat" key={cat.title}>
                <h2 className="catalog-title">{cat.title}</h2>
                <div className={gridClass}>
                  {items.map((p) => (
                    <article
                      className="product"
                      key={p.num}
                      onClick={() => openProductPage(p)}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openProductPage(p)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Vezi detalii: ${p.name || `Produs ${p.num}`}`}
                    >
                      <div className={`product-media${p.fit === "contain" ? " contain" : ""}`}>
                        {p.img ? (
                          <img src={p.img} alt={p.name || `Produs ${p.num}`} loading="lazy" />
                        ) : (
                          <div className="product-ph" />
                        )}
                      </div>
                      <div className="product-body">
                        <h3 className="product-name">{p.name || `Produs ${p.num}`}</h3>
                        {p.desc && <p className="product-desc">{p.desc}</p>}
                        {p.price && <span className="product-price">{p.price}</span>}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer" id="contact">
        <div className="h-wrap">
          <div className="footer-inner">
            <div className="footer-bottom">
              <span>© {new Date().getFullYear()} Hosman Accessories. Toate drepturile rezervate.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
    <ContactButton />
    </>
  );
}