import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardApi, DashboardStats } from '@/services/api';
import { Image, Video, Megaphone, Activity, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

type GroupedActivity = {
  date: string;
  items: DashboardStats['recentActivity'];
};

function groupByDate(activities: DashboardStats['recentActivity']): GroupedActivity[] {
  const map = new Map<string, DashboardStats['recentActivity']>();
  for (const a of activities) {
    const key = new Date(a.date).toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(a);
  }
  return Array.from(map.entries()).map(([date, items]) => ({ date, items }));
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityOpen, setActivityOpen] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (err) {
      setError('Impossible de charger les statistiques. Vérifiez que votre backend est en ligne.');
      // Données de démonstration en cas d'erreur
      setStats({
        totalPhotos: 0,
        totalVideos: 0,
        totalAnnouncements: 0,
        recentActivity: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Photos',
      value: stats?.totalPhotos || 0,
      icon: Image,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'Vidéos',
      value: stats?.totalVideos || 0,
      icon: Video,
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      title: 'Annonces',
      value: stats?.totalAnnouncements || 0,
      icon: Megaphone,
      color: 'bg-primary/10 text-primary',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Gérez votre contenu Art pour Christ
          </p>
        </div>

        {error && (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              {statCards.map((stat) => (
                <Card key={stat.title} className="shadow-card">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card className="shadow-card">
              <CardHeader
                className="cursor-pointer select-none"
                onClick={() => setActivityOpen(o => !o)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    <CardTitle>Activité récente</CardTitle>
                  </div>
                  {activityOpen
                    ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
                <CardDescription>
                  {stats?.recentActivity?.length ?? 0} action(s) — cliquez pour {activityOpen ? 'masquer' : 'afficher'}
                </CardDescription>
              </CardHeader>

              {activityOpen && (
                <CardContent>
                  {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                    <div className="space-y-6">
                      {groupByDate(stats.recentActivity).map(({ date, items }) => (
                        <div key={date}>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 capitalize">
                            {date}
                          </p>
                          <div className="space-y-2">
                            {items.map((activity, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                              >
                                <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                  {activity.type === 'photo' && <Image className="w-4 h-4 text-primary" />}
                                  {activity.type === 'video' && <Video className="w-4 h-4 text-primary" />}
                                  {activity.type === 'announcement' && <Megaphone className="w-4 h-4 text-primary" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{activity.title}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {activity.action === 'created' && 'Créé'}
                                    {activity.action === 'updated' && 'Modifié'}
                                    {activity.action === 'deleted' && 'Supprimé'}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Aucune activité récente. Commencez à ajouter du contenu!
                    </p>
                  )}
                </CardContent>
              )}
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
