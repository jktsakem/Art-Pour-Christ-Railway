import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Music, Sparkles } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Dévotion",
    description:
      "Chaque performance est une offrande d'amour à notre Créateur",
  },
  {
    icon: Music,
    title: "Excellence",
    description:
      "Nous nous efforçons d'offrir le meilleur de nos talents à Dieu",
  },
  {
    icon: Users,
    title: "Communion",
    description:
      "Ensemble, nous formons une famille unie dans la foi et l'art",
  },
  {
    icon: Sparkles,
    title: "Créativité",
    description:
      "Explorer de nouvelles façons d'exprimer la gloire de Dieu",
  },
];

const AboutSection = () => {
  return (
    <section id="apropos" className="py-24 bg-gradient-section">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                À Propos
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                Notre <span className="text-gradient-gold">Mission</span>
              </h2>
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Art pour Christ</strong> est
                un ministère artistique au sein de l'église MEEC Centre, dédié à
                glorifier Dieu à travers les arts de la scène.
              </p>
              <p>
                Notre équipe passionnée crée des sketches, des chant inspirants et des
                chorégraphies de louange qui touchent les cœurs et élèvent les
                âmes vers notre Créateur.
              </p>
              <p>
                Que ce soit lors des célébrations spéciales, des cultes
                dominicaux ou des événements communautaires, nous mettons nos
                talents au service du Royaume pour inspirer, édifier et
                encourager notre communauté de foi.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div className="text-center">
                <p className="font-display text-4xl font-bold text-gradient-gold">
                  25+
                </p>
                <p className="text-sm text-muted-foreground mt-1">Membres</p>
              </div>
              <div className="text-center">
                <p className="font-display text-4xl font-bold text-gradient-gold">
                  50+
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Prestations
                </p>
              </div>
              <div className="text-center">
                <p className="font-display text-4xl font-bold text-gradient-gold">
                  5
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Années
                </p>
              </div>
            </div>
          </div>

          {/* Right Content - Values Grid */}
          <div className="grid grid-cols-2 gap-4">
            {values.map((value, index) => (
              <Card
                key={value.title}
                className="group hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-gold flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
