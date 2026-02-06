import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi, getAuthToken } from "@/services/api";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import FeatureList from "@/components/FeatureList";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, FileText, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@/types/project";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalProjects: 0, teamsWithProjects: 0, projectsWithPdf: 0 });

  useEffect(() => {
    if (!getAuthToken()) {
      navigate("/admin/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [projectsData, statsData] = await Promise.all([
          adminApi.getAllProjects(),
          adminApi.getStats(),
        ]);
        setProjects(projectsData);
        setStats(statsData);
      } catch (error: any) {
        toast({
          title: "Failed to load data",
          description: error.message,
          variant: "destructive",
        });
        if (error.status === 403 || error.status === 401) {
          navigate("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, toast]);

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.teamId.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto flex max-w-5xl items-center justify-center px-4 py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <p className="text-sm text-muted-foreground">
              {stats.totalProjects} total submissions • {stats.teamsWithProjects} teams • {stats.projectsWithPdf} with PDFs
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by team or email…"
              className="pl-9 text-sm"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed py-16 text-center">
            <p className="text-sm text-muted-foreground">
              {projects.length === 0 ? "No submissions yet." : "No results match your filter."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} showTeam onView={() => setSelected(p)} />
            ))}
          </div>
        )}

        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle>{selected.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded bg-secondary px-2 py-1">Team: {selected.teamId}</span>
                    <span className="rounded bg-secondary px-2 py-1">{selected.email}</span>
                  </div>

                  <p className="text-sm text-muted-foreground">{selected.description}</p>

                  <a
                    href={selected.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Open GitHub Repo
                  </a>

                  {selected.promptPdfName && (
                    <a
                      href={selected.promptPdfUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary/80"
                    >
                      <FileText className="h-4 w-4" />
                      <span>View PDF: {selected.promptPdfName.split('/').pop()}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Key Features (ranked)</h4>
                    <FeatureList features={selected.features} onChange={() => {}} readOnly />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Submitted {new Date(selected.submittedAt).toLocaleString()}
                  </p>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminDashboard;
