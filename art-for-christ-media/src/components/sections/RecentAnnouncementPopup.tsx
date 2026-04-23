import { useEffect, useMemo, useState } from "react";
import { X, Megaphone, Calendar, Clock } from "lucide-react";
import { announcementsApi, Announcement } from "@/services/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "recent-announcement-popup-dismissed-id";

const RecentAnnouncementPopup = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    announcementsApi
      .getAll()
      .then(setAnnouncements)
      .catch(() => setAnnouncements([]))
      .finally(() => setIsLoading(false));
  }, []);

  const recentAnnouncement = useMemo(() => {
    if (announcements.length === 0) return null;

    return [...announcements].sort((a, b) => {
      const aDate = new Date(a.createdAt || a.date).getTime();
      const bDate = new Date(b.createdAt || b.date).getTime();
      return bDate - aDate;
    })[0];
  }, [announcements]);

  useEffect(() => {
    if (!recentAnnouncement) return;
    const dismissedId = sessionStorage.getItem(STORAGE_KEY);
    if (dismissedId === recentAnnouncement.id) {
      setIsClosed(true);
    } else {
      setIsClosed(false);
    }
  }, [recentAnnouncement]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const closePopup = () => {
    if (recentAnnouncement) {
      sessionStorage.setItem(STORAGE_KEY, recentAnnouncement.id);
    }
    setIsClosed(true);
  };

  if (isLoading || !recentAnnouncement || isClosed) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-lg animate-in slide-in-from-bottom-3 fade-in duration-300">
      <Card className="border-primary/30 shadow-elevated bg-card/95 backdrop-blur">
        <div className="h-1 w-full bg-gradient-gold rounded-t-xl" />
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-primary">
              <Megaphone className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Nouvelle annonce
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closePopup}
              aria-label="Fermer l'alerte"
              className="h-7 w-7"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <h3 className="text-sm font-bold leading-snug text-foreground">
            {recentAnnouncement.title}
          </h3>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {recentAnnouncement.description}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {formatDate(recentAnnouncement.date)}
              </span>
              {recentAnnouncement.time && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  {recentAnnouncement.time}
                </span>
              )}
            </div>
            <Button
              variant="gold"
              size="sm"
              className="text-xs h-7 px-3"
              onClick={() => {
                closePopup();
                const el = document.querySelector("#annonces");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Voir les annonces
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentAnnouncementPopup;
