import { useState, useEffect } from "react";
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
  { title: "Tăvi de irigare și lădițe", nums: [6, 7] },
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
        window.scrollTo({ top: 0 });
      }
    }
  }, []);

  const goTo = (i) =>
    SLIDES.length > 0 && setActive((i + SLIDES.length) % SLIDES.length);

  const openProductPage = (p) => {
    setOpenProduct(p);
    window.scrollTo({ top: 0, behavior: "auto" });
  };
  const closeProductPage = () => {
    setOpenProduct(null);
    // după ce revine pagina principală, derulăm la secțiunea catalog
    requestAnimationFrame(() => {
      const el = document.getElementById("catalog");
      if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
      else window.scrollTo({ top: 0 });
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