import { Phone } from "lucide-react";
import "./App.css";

/* Buton flotant „Contact us" — mereu în dreapta-jos, pe tot site-ul.
   La click pornește apelul telefonic. */
export default function ContactButton() {
  return (
    <a className="contact-fab" href="tel:+37379434108" aria-label="Sună-ne la +373 794 34 108">
      <Phone size={20} className="contact-fab-ic" />
      <span className="contact-fab-text">
        <span className="contact-fab-label">Contact us</span>
        <span className="contact-fab-phone">+373 794 34 108</span>
      </span>
    </a>
  );
}