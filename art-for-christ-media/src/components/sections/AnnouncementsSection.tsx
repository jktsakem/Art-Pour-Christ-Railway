import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, ArrowRight, Loader2, Megaphone, ExternalLink } from "lucide-react";
import { announcementsApi, Announcement } from "@/services/api";

const AnnouncementsSection = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("Tous");

  useEffect(() => {
    announcementsApi
      .getAll()
      .then(setAnnouncements)
      .catch(() => setAnnouncements([]))
      .finally(() => setIsLoading(false));
  }, []);

  const featuredAnnouncements = announcements.filter((a) => a.featured);
  const otherAnnouncements = announcements.filter((a) => !a.featured);

  const categories = [
    "Tous",
    ...Array.from(new Set(announcements.map((a) => a.category).filter(Boolean))),
  ];

  const filteredOthers =
    activeCategory === "Tous"
      ? otherAnnouncements
      : otherAnnouncements.filter((a) => a.category === activeCategory);

  const getDateParts = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return {
        day: date.toLocaleDateString("fr-FR", { day: "2-digit" }),
        month: date
          .toLocaleDateString("fr-FR", { month: "short" })
          .toUpperCase()
          .replace(".", ""),
        year: date.getFullYear(),
      };
    } catch {
      return { day: "--", month: "---", year: "" };
    }
  };

  return (
    <section id="annonces" className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Programme
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Annonces &{" "}
            <span className="text-gradient-gold">Activités</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Restez informés de nos prochains événements et rejoignez-nous
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>Aucune annonce disponible pour le moment.</p>
          </div>
        ) : (
          <>
            {/* Featured Announcements */}
            {featuredAnnouncements.map((announcement) => {
              const dateParts = getDateParts(announcement.date);
              return (
                <div
                  key={announcement.id}
                  className="mb-12 rounded-2xl overflow-hidden border border-primary/20 shadow-elevated bg-card animate-fade-in"
                >
                  {/* Top gold accent bar */}
                  <div className="h-1.5 w-full bg-gradient-gold" />

                  {/* Image bannière si disponible */}
                  {announcement.imageUrl && (
                    <div className="w-full h-52 md:h-64 overflow-hidden">
                      <img
                        src={announcement.imageUrl}
                        alt={announcement.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}

                  <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
                    {/* Date block */}
                    <div className="flex-shrink-0">
                      <div className="w-24 rounded-xl overflow-hidden border border-primary/30 shadow-soft text-center">
                        <div className="bg-gradient-gold py-1.5">
                          <span className="text-xs font-bold text-primary-foreground uppercase tracking-widest">
                            {dateParts.month}
                          </span>
                        </div>
                        <div className="py-3 bg-card">
                          <span className="font-display text-4xl font-bold text-foreground leading-none block">
                            {dateParts.day}
                          </span>
                          <span className="text-xs text-muted-foreground mt-1 block">
                            {dateParts.year}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-gradient-gold text-primary-foreground text-xs font-semibold">
                          ★ À la une
                        </span>
                        {announcement.category && (
                          <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium border border-secondary/20">
                            {announcement.category}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                        {announcement.title}
                      </h3>

                      <p className="text-muted-foreground leading-relaxed max-w-2xl">
                        {announcement.description}
                      </p>

                      <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
                        {announcement.time && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-primary" />
                            {announcement.time}
                          </span>
                        )}
                        {announcement.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-primary" />
                            {announcement.location}
                          </span>
                        )}
                      </div>

                      {announcement.linkUrl ? (
                        <a
                          href={announcement.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="gold">
                            En savoir plus
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      ) : (
                        <Button variant="gold">
                          En savoir plus
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Category filter */}
            {categories.length > 2 && (
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeCategory === cat
                        ? "bg-gradient-gold text-primary-foreground shadow-soft"
                        : "bg-muted text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Other Announcements — Timeline */}
            <div className="max-w-3xl mx-auto space-y-4">
              {filteredOthers.map((announcement, index) => {
                const dateParts = getDateParts(announcement.date);
                const isLast = index === filteredOthers.length - 1;
                return (
                  <div key={announcement.id} className="flex gap-5 group">
                    {/* Date + vertical line */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-16 rounded-lg overflow-hidden border border-border text-center group-hover:border-primary/40 transition-colors duration-300 shadow-soft">
                        <div className="bg-muted py-1">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                            {dateParts.month}
                          </span>
                        </div>
                        <div className="py-2 bg-card">
                          <span className="font-display text-2xl font-bold text-foreground leading-none block">
                            {dateParts.day}
                          </span>
                        </div>
                      </div>
                      {!isLast && (
                        <div className="flex-1 w-px bg-border mt-2 min-h-6" />
                      )}
                    </div>

                    {/* Card */}
                    <Card className="flex-1 mb-2 group-hover:shadow-elevated group-hover:-translate-y-0.5 transition-all duration-300 border-border hover:border-primary/20">
                      <CardContent className="p-5">
                        {/* Image thumbnail si disponible */}
                        {announcement.imageUrl && (
                          <div className="mb-3 rounded-lg overflow-hidden">
                            <img
                              src={announcement.imageUrl}
                              alt={announcement.title}
                              className="w-full h-36 object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          {announcement.category && (
                            <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium inline-block">
                              {announcement.category}
                            </span>
                          )}
                          <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                            {announcement.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {announcement.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                            {announcement.time && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-primary" />
                                {announcement.time}
                              </span>
                            )}
                            {announcement.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-primary" />
                                {announcement.location}
                              </span>
                            )}
                          </div>
                          {announcement.linkUrl && (
                            <a
                              href={announcement.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                              En savoir plus
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AnnouncementsSection;
