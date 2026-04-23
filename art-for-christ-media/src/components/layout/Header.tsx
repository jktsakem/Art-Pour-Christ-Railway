import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#accueil", label: "Accueil" },
    { href: "#galerie", label: "Galerie" },
    { href: "#annonces", label: "Annonces" },
    { href: "#apropos", label: "À Propos" },
    { href: "#contact", label: "Contact" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-card"
          : "bg-black/40 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#accueil"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#accueil");
            }}
            className="flex items-center gap-3"
          >
            <img src={logo} alt="Logo Art pour Christ" className="w-10 h-10 rounded-full object-cover" />
            <div className="flex flex-col">
              <span className={`font-display font-bold text-lg leading-tight [text-shadow:_0_2px_8px_rgba(0,0,0,0.5)] ${isScrolled ? 'text-foreground' : 'text-white'}`}>
                Art pour Christ
              </span>
              <span className={`text-xs [text-shadow:_0_1px_4px_rgba(0,0,0,0.5)] ${isScrolled ? 'text-muted-foreground' : 'text-white/80'}`}>MEEC Centre</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className={`text-sm font-medium transition-colors duration-200 [text-shadow:_0_1px_4px_rgba(0,0,0,0.5)] ${
                  isScrolled 
                    ? 'text-foreground/80 hover:text-primary' 
                    : 'text-white hover:text-primary'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button variant="gold" size="sm">
              Nous Rejoindre
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 [filter:_drop-shadow(0_2px_4px_rgba(0,0,0,0.5))] ${isScrolled ? 'text-foreground' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 [filter:_drop-shadow(0_2px_4px_rgba(0,0,0,0.5))] ${isScrolled ? 'text-foreground' : 'text-white'}`} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/20 animate-slide-up bg-black/60 backdrop-blur-md rounded-b-lg">
            <div className="flex flex-col gap-4 px-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className="text-sm font-medium text-white hover:text-primary transition-colors py-2 [text-shadow:_0_1px_4px_rgba(0,0,0,0.5)]"
                >
                  {link.label}
                </a>
              ))}
              <Button variant="gold" size="sm" className="mt-2">
                Nous Rejoindre
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
