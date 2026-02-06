import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectContext } from "@/context/ProjectContext";
import { projectsApi } from "@/services/api";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import FeatureList from "@/components/FeatureList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, ExternalLink, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@/types/project";

const ViewProject = () => {
  const navigate = useNavigate();
  const { getTeamProjects, setProjects, isAuthenticated } = useProjectContext();
  const { toast } = useToast();
  const [selected, setSelected] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    const fetchProjects = async () => {
      try {
        const projects = await projectsApi.getTeamProjects();
        setProjects(projects);
      } catch (error: any) {
        toast({
          title: "Failed to load projects",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isAuthenticated, navigate, setProjects, toast]);

  const teamProjects = getTeamProjects();

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
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
        </button>

        <h2 className="mb-6 text-xl font-bold">Submitted Projects</h2>

        {teamProjects.length === 0 ? (
          <div className="rounded-lg border border-dashed py-16 text-center">
            <p className="text-sm text-muted-foreground">No projects submitted yet.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/add-project")}>
              Add your first project
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {teamProjects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onView={() => setSelected(p)}
                onEdit={() => navigate(`/add-project?edit=${p.id}`)}
              />
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
                  <p className="text-sm text-muted-foreground">{selected.description}</p>

                  <a
                    href={selected.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> View on GitHub
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
                    <h4 className="mb-2 text-sm font-semibold">Key Features</h4>
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

export default ViewProject;
