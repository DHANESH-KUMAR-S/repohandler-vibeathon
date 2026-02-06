import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectContext } from "@/context/ProjectContext";
import { projectsApi } from "@/services/api";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Eye, Loader2, Rocket, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const { getTeamProjects, setProjects, isAuthenticated } = useProjectContext();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const teamProjects = getTeamProjects();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
        <Header />
        <main className="mx-auto flex max-w-5xl items-center justify-center px-4 py-20">
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <Header />
      
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl"
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

      <main className="relative mx-auto max-w-5xl px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            Dashboard
          </h2>
          <p className="mt-2 text-muted-foreground">
            Manage your team's project submission
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2"
        >
          {/* Add Project Card */}
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Card
                className="group relative cursor-pointer overflow-hidden border-2 border-dashed transition-all hover:border-primary hover:shadow-2xl hover:shadow-primary/20"
                onClick={() => navigate("/add-project")}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 transition-all group-hover:from-primary/5 group-hover:to-primary/10" />
                
                <CardContent className="relative flex flex-col items-center justify-center py-16 text-center">
                  <motion.div
                    className="mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/60 p-4 shadow-lg"
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Plus className="h-8 w-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold">Add Project</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Submit a new project for review
                  </p>
                  
                  <motion.div
                    className="mt-4 flex items-center gap-2 text-xs text-primary"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <Rocket className="h-4 w-4" />
                    Get started now
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* View Projects Card */}
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{ scale: teamProjects.length > 0 ? 1.02 : 1, y: teamProjects.length > 0 ? -5 : 0 }}
              whileTap={{ scale: teamProjects.length > 0 ? 0.98 : 1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Card
                className={`group relative cursor-pointer overflow-hidden border-2 transition-all hover:shadow-2xl ${
                  teamProjects.length === 0
                    ? "opacity-60 hover:shadow-muted/20"
                    : "hover:border-primary hover:shadow-primary/20"
                }`}
                onClick={() => teamProjects.length > 0 && navigate("/view-project")}
              >
                {/* Gradient overlay on hover */}
                {teamProjects.length > 0 && (
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 transition-all group-hover:from-accent/10 group-hover:to-accent/20" />
                )}
                
                <CardContent className="relative flex flex-col items-center justify-center py-16 text-center">
                  <motion.div
                    className={`mb-4 rounded-2xl p-4 shadow-lg ${
                      teamProjects.length === 0
                        ? "bg-muted"
                        : "bg-gradient-to-br from-accent to-accent/60"
                    }`}
                    whileHover={teamProjects.length > 0 ? { rotate: [0, -10, 10, -10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {teamProjects.length === 0 ? (
                      <FolderOpen className="h-8 w-8 text-muted-foreground" />
                    ) : (
                      <Eye className="h-8 w-8 text-primary" />
                    )}
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold">View Submitted Projects</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {teamProjects.length === 0
                      ? "No projects submitted yet"
                      : `${teamProjects.length} project${teamProjects.length > 1 ? "s" : ""} submitted`}
                  </p>
                  
                  {teamProjects.length > 0 && (
                    <motion.div
                      className="mt-4 flex items-center gap-2 text-xs text-primary"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <Eye className="h-4 w-4" />
                      View details
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        {teamProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8"
          >
            <Card className="border-2 bg-gradient-to-br from-card to-accent/5">
              <CardContent className="py-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{teamProjects.length}</p>
                    <p className="text-xs text-muted-foreground">Projects</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {teamProjects.reduce((sum, p) => sum + p.features.length, 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Features</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {teamProjects.filter((p) => p.promptPdfName).length}
                    </p>
                    <p className="text-xs text-muted-foreground">PDFs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
