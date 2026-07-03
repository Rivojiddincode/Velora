import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RiGlobalLine } from "react-icons/ri";
import "./LanguageSwitcher.css";

const LANGS = [
  { code: "uz", label: "O'zbek" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const current = LANGS.find((l) => l.code === i18n.language) || LANGS[0];

  return (
    <div className="lang-switcher" ref={ref}>
      <button type="button" className="lang-switcher-btn" onClick={() => setOpen((o) => !o)}>
        <RiGlobalLine />
        <span>{current.code.toUpperCase()}</span>
      </button>
      {open && (
        <ul className="lang-switcher-menu">
          {LANGS.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                className={l.code === i18n.language ? "active" : ""}
                onClick={() => {
                  i18n.changeLanguage(l.code);
                  setOpen(false);
                }}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
