import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Image as ImageIcon, X, Loader2, ChevronDown } from "lucide-react";
import { photosApi, videosApi, Photo, Video } from "@/services/api";

interface GalleryItem {
  id: string;
  type: "video" | "image";
  title: string;
  thumbnail: string;
  url: string;
  date: string;
  description?: string;
}

const GallerySection = () => {
  const [filter, setFilter] = useState<"all" | "video" | "image">("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const [photos, videos] = await Promise.all([
          photosApi.getAll().catch(() => [] as Photo[]),
          videosApi.getAll().catch(() => [] as Video[]),
        ]);

        const photoItems: GalleryItem[] = photos.map((p) => ({
          id: p.id,
          type: "image",
          title: p.title,
          thumbnail: p.url,
          url: p.url,
          date: new Date(p.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        }));

        const videoItems: GalleryItem[] = videos.map((v) => ({
          id: v.id,
          type: "video",
          title: v.title,
          thumbnail: v.thumbnail,
          url: v.url,
          description: v.description,
          date: new Date(v.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        }));

        // Merge and sort by date descending
        const merged = [...photoItems, ...videoItems].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setGalleryItems(merged);
      } catch {
        setGalleryItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadGallery();
  }, []);

  const filteredItems = galleryItems.filter(
    (item) => filter === "all" || item.type === filter
  );

  return (
    <section id="galerie" className="py-24 bg-gradient-section">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Notre Galerie
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Moments de <span className="text-gradient-gold">Gloire</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Revivez les moments forts de nos prestations à travers photos et vidéos
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          <Button
            variant={filter === "all" ? "gold" : "outline"}
            onClick={() => setFilter("all")}
          >
            Tout
          </Button>
          <Button
            variant={filter === "video" ? "gold" : "outline"}
            onClick={() => setFilter("video")}
          >
            <Play className="w-4 h-4 mr-1" />
            Vidéos
          </Button>
          <Button
            variant={filter === "image" ? "gold" : "outline"}
            onClick={() => setFilter("image")}
          >
            <ImageIcon className="w-4 h-4 mr-1" />
            Photos
          </Button>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>Aucun contenu disponible pour le moment.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <Card
              key={item.id}
              className="group overflow-hidden cursor-pointer shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              onClick={() => {
                setSelectedItem(item);
                setIsDescriptionOpen(false);
              }}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Play Button for Videos */}
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-7 h-7 text-primary-foreground ml-1" />
                    </div>
                  </div>
                )}

                {/* Overlay Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-sm text-cream/80">{item.date}</p>
                  <h3 className="font-display text-lg font-semibold text-cream">
                    {item.title}
                  </h3>
                </div>
              </div>
            </Card>
          ))}
        </div>
        )}

        {/* View More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Voir plus de contenu
          </Button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <button
            className="absolute top-6 right-6 text-cream hover:text-primary transition-colors"
            onClick={() => setSelectedItem(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div
            className="max-w-4xl w-full bg-card rounded-lg overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedItem.type === "video" ? (
              <video
                src={selectedItem.url}
                poster={selectedItem.thumbnail}
                controls
                className="w-full aspect-video object-cover"
              />
            ) : (
              <img
                src={selectedItem.url}
                alt={selectedItem.title}
                className="w-full aspect-video object-cover"
                loading="eager"
                decoding="async"
              />
            )}
            <div className="p-6">
              <p className="text-sm text-primary">{selectedItem.date}</p>
              <h3 className="font-display text-2xl font-bold text-foreground mt-1">
                {selectedItem.title}
              </h3>

              {selectedItem.type === "video" && selectedItem.description && (
                <div className="mt-4 border-t pt-4">
                  <button
                    type="button"
                    onClick={() => setIsDescriptionOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between text-left text-foreground hover:text-primary transition-colors"
                  >
                    <span className="font-medium">Description</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isDescriptionOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isDescriptionOpen ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-muted-foreground leading-relaxed">
                        {selectedItem.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
