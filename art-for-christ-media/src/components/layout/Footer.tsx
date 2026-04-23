import { Heart } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo Art pour Christ" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 className="font-display font-bold text-lg">
                  Art pour Christ
                </h3>
                <p className="text-sm text-secondary-foreground/70">
                  MEEC Centre
                </p>
              </div>
            </div>
            <p className="text-sm text-secondary-foreground/80 leading-relaxed">
              Glorifier Dieu à travers l'art, les sketches et les danses.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li>
                <a
                  href="#accueil"
                  className="hover:text-gold transition-colors"
                >
                  Accueil
                </a>
              </li>
              <li>
                <a
                  href="#galerie"
                  className="hover:text-gold transition-colors"
                >
                  Galerie
                </a>
              </li>
              <li>
                <a
                  href="#annonces"
                  className="hover:text-gold transition-colors"
                >
                  Annonces
                </a>
              </li>
              <li>
                <a
                  href="#apropos"
                  className="hover:text-gold transition-colors"
                >
                  À Propos
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-gold transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li>Église MEEC Centre</li>
              <li>Yaoundé, Cameroun</li>
              <li>artpourchrist@meec-centre.org</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-secondary-foreground/70">
              © {currentYear} Art pour Christ - MEEC Centre. Tous droits
              réservés.
            </p>
            <p className="flex items-center gap-1 text-sm text-secondary-foreground/70">
              Fait avec <Heart className="w-4 h-4 text-gold" /> pour la gloire
              de Dieu
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
