import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Check, Diamond, FileText, Volume2, VolumeX } from "lucide-react";
import "./App.css";

/* Slideshow pentru imaginea produsului (poze + video, crossfade + puncte).
   `fit`: dacă e "contain", pozele se văd ÎNTREGI, fără crop (pentru poze
   de produs pe fundal alb). Altfel, "cover" (umple caseta, decupează). */
function RollSlideshow({ items, alt, fit, sound = true }) {
  const [i, setI] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const videoRefs = useRef({});

  useEffect(() => {
    if (items.length <= 1) return;
    if (items[i]?.video || items[i]?.youtube) return; // pe video / YouTube nu avansăm automat
    const t = setTimeout(() => setI((p) => (p + 1) % items.length), 4000);
    return () => clearTimeout(t);
  }, [i, items.length]);

  // sunet doar pe slide-ul activ (restul rămân mute chiar dacă rulează în fundal)
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([idx, v]) => {
      if (v) v.muted = !(soundOn && Number(idx) === i);
    });
  }, [soundOn, i, items.length]);

  if (items.length === 0) return <div className="pp-roll-ph" />;

  return (
    <div className={`pp-roll-show${fit === "contain" ? " contain" : ""}`}>
      {items.map((it, idx) =>
        it.youtube ? (
          <iframe
            key={idx}
            className={`pp-roll-img ${idx === i ? "active" : ""}`}
            src={`https://www.youtube.com/embed/${it.youtube}?rel=0${it.start ? `&start=${it.start}` : ""}`}
            title={alt}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : it.video ? (
          <video
            key={idx}
            ref={(el) => { videoRefs.current[idx] = el; }}
            src={it.src}
            className={`pp-roll-img ${idx === i ? "active" : ""}`}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
          />
        ) : (
          <img
            key={idx}
            src={it.src}
            alt={alt}
            loading="lazy"
            className={`pp-roll-img ${idx === i ? "active" : ""}`}
          />
        )
      )}

      {sound && items[i]?.video && (
        <button
          type="button"
          className="pp-roll-sound"
          onClick={() => setSoundOn((s) => !s)}
          aria-label={soundOn ? "Oprește sunetul" : "Pornește sunetul"}
        >
          {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      )}

      {items.length > 1 && (
        <div className="pp-roll-dots">
          {items.map((_, idx) => (
            <button
              key={idx}
              className={idx === i ? "active" : ""}
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setI(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PAGINA DE PRODUS - șablon reutilizabil.
   Primește un obiect `product` (din PRODUCT_INFO) și afișează
   doar secțiunile pentru care există date. Câmpuri folosite:
     name, intro, img, heroImg, features[], coverTitle, coverText,
     applications[], specs[{k,v}], flyer, gallery[]
   ============================================================ */
export default function ProductPage({ product, onBack, lang = "ro", onChangeLang = () => {} }) {
  const p = product || {};
  const title = p.name || `Produs ${p.num}`;

  return (
    <div className="hosman product-page" id="acasa">
      {/* bară sus cu buton înapoi + logo */}
      <div className="pp-topbar">
        <div className="h-wrap pp-topbar-inner">
          <button className="pp-back" onClick={onBack}>
            <ArrowLeft size={20} /> Înapoi la catalog
          </button>
          <button className="pp-brand" onClick={onBack} aria-label="Pagina principală">
            <span className="brand-script notranslate" translate="no">Hosman Accessories</span>
          </button>
          <div className="lang-switch notranslate" translate="no">
            <button
              className={`lang-btn${lang === "ro" ? " active" : ""}`}
              onClick={() => onChangeLang("ro")}
            >
              RO
            </button>
            <button
              className={`lang-btn${lang === "ru" ? " active" : ""}`}
              onClick={() => onChangeLang("ru")}
            >
              RU
            </button>
            <button
              className={`lang-btn${lang === "en" ? " active" : ""}`}
              onClick={() => onChangeLang("en")}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* HERO: text + imagine diagonală */}
      <section
        className="pp-hero"
        style={p.heroFit === "contain" ? { background: "#fff" } : undefined}
      >
        <div className="pp-hero-inner h-wrap">
          <h1 className="pp-title">{title}</h1>
          {p.intro && <p className="pp-intro">{p.intro}</p>}
        </div>
        <div
          className="pp-hero-img"
          style={
            p.heroImg
              ? {
                  backgroundImage: `url('${p.heroImg}')`,
                  ...(p.heroPos ? { backgroundPosition: p.heroPos } : {}),
                  ...(p.heroFit === "contain"
                    ? {
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundColor: p.heroBg || "#fff",
                      }
                    : {}),
                }
              : undefined
          }
        />
      </section>

      {/* AVANTAJE: imaginea produsului + caseta cu bife */}
      <section className="pp-highlights">
        <div className="pp-highlights-inner h-wrap">
          <div className="pp-roll">
            <RollSlideshow
              items={p.slides?.length ? p.slides : p.img ? [{ src: p.img, video: false }] : []}
              alt={title}
              fit={p.fit}
              sound={p.sound !== false}
            />
          </div>

          {(p.features?.length > 0 || p.origin) && (
            <div className="pp-side">
              {p.features?.length > 0 && (
                <ul className="pp-features">
                  {p.features.map((f, i) => (
                    <li key={i}>
                      <span className="pp-feature-ic"><Check size={16} /></span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              {p.origin && (
                <div className="pp-madein">
                  <img
                    className="pp-flag"
                    src={`https://flagcdn.com/${p.origin.code}.svg`}
                    alt=""
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  <span className="pp-madein-text">
                    <span className="pp-madein-label" translate="no">MADE IN</span>
                    <span className="pp-madein-country">{p.origin.country}</span>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* TITLU EVIDENȚIAT + descriere */}
      {(p.coverTitle || p.coverText) && (
        <section className="pp-cover">
          <div className="h-wrap">
            {p.coverTitle && (
              <h2 className="pp-cover-title">
                <mark>{p.coverTitle}</mark>
              </h2>
            )}
            {p.coverText && <p className="pp-cover-text">{p.coverText}</p>}
          </div>
        </section>
      )}

      {/* APLICAȚII */}
      {p.applications?.length > 0 && (
        <section className="pp-block">
          <div className="h-wrap">
            <h3 className="pp-h3">Aplicații</h3>
            <div className="pp-apps-box">
              {p.applications.map((a, i) => (
                <div className="pp-app" key={i}>
                  <span className="pp-app-ic"><Diamond size={18} /></span>
                  {a}
                </div>
              ))}
            </div>
            {p.applicationsNote && <p className="pp-list-note">{p.applicationsNote}</p>}
          </div>
        </section>
      )}

      {/* BENEFICII */}
      {p.benefits?.length > 0 && (
        <section className="pp-block">
          <div className="h-wrap">
            <h3 className="pp-h3">Beneficii</h3>
            <ul className="pp-list">
              {p.benefits.map((b, i) => (
                <li key={i}><span className="pp-dot" /> {b}</li>
              ))}
            </ul>
            {p.benefitsNote && <p className="pp-list-note">{p.benefitsNote}</p>}
          </div>
        </section>
      )}

      {/* AVANTAJE */}
      {p.advantages?.length > 0 && (
        <section className="pp-block">
          <div className="h-wrap">
            <h3 className="pp-h3">Avantaje</h3>
            <ul className="pp-list">
              {p.advantages.map((a, i) => (
                <li key={i}><span className="pp-dot" /> {a}</li>
              ))}
            </ul>
            {p.advantagesNote && <p className="pp-list-note">{p.advantagesNote}</p>}
          </div>
        </section>
      )}

      {/* EXPERIMENT FĂCUT DE SPECIALIȘTI */}
      {p.experimentText && (
        <section className="pp-block">
          <div className="h-wrap">
            <h3 className="pp-h3">{p.experimentTitle || "Experiment făcut de specialiști"}</h3>
            <p className="pp-cover-text">{p.experimentText}</p>
          </div>
        </section>
      )}

      {/* SPECIFICAȚII TEHNICE */}
      {p.specs?.length > 0 && (
        <section className="pp-block">
          <div className="h-wrap">
            <h3 className="pp-h3">Specificații tehnice</h3>
            <table className="pp-specs">
              <tbody>
                {p.specs.map((s, i) => (
                  <tr key={i}>
                    <th>{s.k}</th>
                    <td>{s.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {p.specs.some((s) => /\*/.test(s.k)) && (
              <p className="pp-note">* MD = pe direcția de fabricație, CD = pe direcția transversală.</p>
            )}
          </div>
        </section>
      )}

      {/* DIMENSIUNI DISPONIBILE */}
      {p.sizes?.length > 0 && (
        <section className="pp-block">
          <div className="h-wrap">
            <h3 className="pp-h3">Dimensiuni disponibile</h3>
            <div className="pp-sizes-wrap">
              <table className="pp-sizes">
                <thead>
                  <tr>
                    <th>Dimensiune</th>
                    <th>Culoare</th>
                    <th>Ambalare</th>
                  </tr>
                </thead>
                <tbody>
                  {p.sizes.map((s, idx) => (
                    <tr key={idx}>
                      <td>{s.dim}</td>
                      <td>{s.culoare}</td>
                      <td>1 rolă</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* FLYER */}
      {p.flyer && (
        <div className="h-wrap pp-flyer">
          <a href={p.flyer} target="_blank" rel="noreferrer">
            <FileText size={18} /> Flyer produs: {title}
          </a>
        </div>
      )}

      {/* GALERIE */}
      {p.gallery?.length > 0 && (
        <section className="pp-block">
          <div className="h-wrap">
            <div className="pp-gallery">
              {p.gallery.map((g, i) => (
                <div className="pp-gal" key={i}>
                  <img src={g} alt={`${title}, imaginea ${i + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
  );
}