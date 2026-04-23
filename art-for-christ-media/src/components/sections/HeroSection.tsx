import { Button } from "@/components/ui/button";
import { Play, ChevronDown } from "lucide-react";
// vite-imagetools convertit automatiquement ce JPG en WebP au build (759KB → ~110KB)
import heroImage from "@/assets/hero-worship.jpg";

const HeroSection = () => {
  const scrollToAnnouncements = () => {
    const element = document.querySelector("#annonces");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToGallery = () => {
    const element = document.querySelector("#galerie");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image — fetchPriority=high pour un LCP rapide */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Worship and dance performance"
          className="w-full h-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-white">
              MEEC Centre
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight [text-shadow:_0_4px_20px_rgba(0,0,0,0.8)]">
            Glorifier Dieu{" "}
            <span className="italic text-primary">par l'Art</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed [text-shadow:_0_2px_10px_rgba(0,0,0,0.7)]">
            Art pour Christ est un ministère dédié à l'expression de la foi à travers
            les sketches, les danses et les performances artistiques qui honorent notre
            Seigneur.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button variant="hero" onClick={scrollToAnnouncements}>
              <Play className="w-5 h-5" />
              Voir les annonces
            </Button>
            <Button variant="heroOutline" onClick={scrollToGallery}>
              Voir la galerie
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
          <button
            onClick={scrollToAnnouncements}
            className="flex flex-col items-center gap-2 text-white/80 hover:text-primary transition-colors"
            aria-label="Scroll to announcements"
          >
            <span className="text-sm font-medium [text-shadow:_0_2px_8px_rgba(0,0,0,0.6)]">Annonces</span>
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
