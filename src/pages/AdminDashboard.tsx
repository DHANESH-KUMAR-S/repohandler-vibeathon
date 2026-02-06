import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi, getAuthToken } from "@/services/api";
import Header from "@/components/Header";
import FeatureList from "@/components/FeatureList";
import TeamMemberList from "@/components/TeamMemberList";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  FileText, 
  Search, 
  Loader2, 
  Users, 
  FolderGit2,
  Calendar,
  Mail,
  Hash,
  Sparkles,
  CheckCircle2,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
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
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      (p.teamName && p.teamName.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
        <Header />
        <main className="mx-auto flex max-w-7xl items-center justify-center px-4 py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-8 w-8 text-primary" />
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <Header />
      
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <main className="relative mx-auto max-w-7xl px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Vibeathon 2025 Project Submissions
          </p>
        </motion.div>

        {/* Analytics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Total Submissions */}
          <Card className="border-2 bg-gradient-to-br from-card to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
                  <p className="mt-2 text-3xl font-bold text-primary">{stats.totalProjects}</p>
                </div>
                <div className="rounded-xl bg-primary/10 p-3">
                  <FolderGit2 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teams Participated */}
          <Card className="border-2 bg-gradient-to-br from-card to-accent/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Teams Participated</p>
                  <p className="mt-2 text-3xl font-bold text-primary">{stats.teamsWithProjects}</p>
                </div>
                <div className="rounded-xl bg-accent/20 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* With PDFs */}
          <Card className="border-2 bg-gradient-to-br from-card to-success/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">With PDFs</p>
                  <p className="mt-2 text-3xl font-bold text-success">{stats.projectsWithPdf}</p>
                </div>
                <div className="rounded-xl bg-success/10 p-3">
                  <FileText className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completion Rate */}
          <Card className="border-2 bg-gradient-to-br from-card to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="mt-2 text-3xl font-bold text-primary">
                    {stats.totalProjects > 0 
                      ? Math.round((stats.projectsWithPdf / stats.totalProjects) * 100)
                      : 0}%
                  </p>
                </div>
                <div className="rounded-xl bg-primary/10 p-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project name, team ID, team name, or email..."
              className="pl-10 text-sm"
            />
          </div>
        </motion.div>

        {/* Projects Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="border-2">
            <CardContent className="p-0">
              {filtered.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-sm text-muted-foreground">
                    {projects.length === 0 ? "No submissions yet." : "No results match your search."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Team
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Project
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Features
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Submitted
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filtered.map((project, index) => (
                        <motion.tr
                          key={project.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setSelected(project)}
                          className="cursor-pointer transition-colors hover:bg-accent/5"
                        >
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <Hash className="h-3 w-3 text-muted-foreground" />
                                <span className="font-mono text-xs font-semibold text-primary">
                                  {project.teamId}
                                </span>
                              </div>
                              {project.teamName && (
                                <span className="text-sm font-medium">{project.teamName}</span>
                              )}
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {project.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="font-semibold">{project.name}</span>
                              <span className="line-clamp-1 text-xs text-muted-foreground">
                                {project.description}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="font-mono">
                                {project.features.length}
                              </Badge>
                              {project.teamMembers && project.teamMembers.length > 0 && (
                                <Badge variant="outline" className="font-mono">
                                  <Users className="mr-1 h-3 w-3" />
                                  {project.teamMembers.length}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {project.promptPdfName ? (
                              <Badge className="bg-success/10 text-success hover:bg-success/20">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Complete
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                No PDF
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(project.submittedAt).toLocaleDateString()}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Project Detail Dialog */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            {selected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader className="space-y-3 pb-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <DialogTitle className="text-2xl">{selected.name}</DialogTitle>
                      {selected.teamName && (
                        <p className="mt-1 text-sm text-muted-foreground">{selected.teamName}</p>
                      )}
                    </div>
                    {selected.promptPdfName && (
                      <Badge className="shrink-0 bg-success/10 text-success">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Complete
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="font-mono">
                      <Hash className="mr-1 h-3 w-3" />
                      {selected.teamId}
                    </Badge>
                    <Badge variant="outline">
                      <Mail className="mr-1 h-3 w-3" />
                      {selected.email}
                    </Badge>
                    <Badge variant="outline">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(selected.submittedAt).toLocaleString()}
                    </Badge>
                  </div>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                  {/* Description */}
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Project Description
                    </h4>
                    <p className="rounded-lg bg-muted/50 p-4 text-sm leading-relaxed">
                      {selected.description}
                    </p>
                  </div>

                  {/* GitHub Link */}
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <FolderGit2 className="h-4 w-4 text-primary" />
                      Repository
                    </h4>
                    <a
                      href={selected.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary/80"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open GitHub Repository
                    </a>
                  </div>

                  {/* PDF */}
                  {selected.promptPdfName && (
                    <div>
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                        <FileText className="h-4 w-4 text-primary" />
                        Project Prompts
                      </h4>
                      <a
                        href={selected.promptPdfUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-success/10 px-4 py-2 text-sm font-medium text-success transition-colors hover:bg-success/20"
                      >
                        <FileText className="h-4 w-4" />
                        View PDF: {selected.promptPdfName.split('/').pop()}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  {/* Features */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Key Features
                      <Badge variant="secondary" className="ml-auto">
                        {selected.features.length} features
                      </Badge>
                    </h4>
                    <div className="rounded-lg border-2 border-dashed p-4">
                      <FeatureList features={selected.features} onChange={() => {}} readOnly />
                    </div>
                  </div>

                  {/* Team Members */}
                  {selected.teamMembers && selected.teamMembers.length > 0 && (
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                        <Users className="h-4 w-4 text-primary" />
                        Team Members / Potential Users
                        <Badge variant="secondary" className="ml-auto">
                          {selected.teamMembers.length} members
                        </Badge>
                      </h4>
                      <div className="rounded-lg border-2 border-dashed p-4">
                        <TeamMemberList members={selected.teamMembers} onChange={() => {}} readOnly />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminDashboard;
