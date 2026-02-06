import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProjectContext } from "@/context/ProjectContext";
import { projectsApi } from "@/services/api";
import Header from "@/components/Header";
import FeatureList from "@/components/FeatureList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Feature } from "@/types/project";

const AddProject = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const { session, projects, addProject, updateProject, isAuthenticated } = useProjectContext();
  const { toast } = useToast();

  const existing = editId ? projects.find((p) => p.id === editId) : null;

  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [githubUrl, setGithubUrl] = useState(existing?.githubUrl ?? "");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(existing?.promptPdfName ?? null);
  const [features, setFeatures] = useState<Feature[]>(existing?.features ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Project name is required";
    if (!description.trim()) e.description = "Description is required";
    if (!/^https?:\/\/(www\.)?github\.com\/.+\/.+/.test(githubUrl))
      e.githubUrl = "Enter a valid GitHub repository URL";
    if (features.length === 0) e.features = "Add at least one feature";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate() || !session) return;

    setLoading(true);
    try {
      const projectData = {
        name: name.trim(),
        description: description.trim(),
        githubUrl: githubUrl.trim(),
        features,
      };

      let project;
      if (existing) {
        project = await projectsApi.updateProject(existing.id, projectData);
        updateProject(project);
        toast({
          title: "Project updated",
          description: "Your project has been updated successfully",
        });
      } else {
        project = await projectsApi.createProject(projectData);
        addProject(project);
        toast({
          title: "Project created",
          description: "Your project has been submitted successfully",
        });
      }

      // Upload PDF if selected
      if (pdfFile && project.id) {
        try {
          await projectsApi.uploadPdf(project.id, pdfFile);
          toast({
            title: "PDF uploaded",
            description: "Your PDF has been uploaded successfully",
          });
        } catch (error: any) {
          toast({
            title: "PDF upload failed",
            description: error.message,
            variant: "destructive",
          });
        }
      }

      setSubmitted(true);
    } catch (error: any) {
      toast({
        title: existing ? "Update failed" : "Submission failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setPdfName(file.name);
    } else if (file) {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive",
      });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
          <div className="mb-4 rounded-full bg-accent p-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold">
            {existing ? "Project Updated!" : "Project Submitted!"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your project has been {existing ? "updated" : "submitted"} successfully.
          </p>
          <Button className="mt-6" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>

        <Card>
          <CardHeader>
            <CardTitle>{existing ? "Edit Project" : "Add Project"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="name">Project Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Awesome Project" />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="desc">Project Description</Label>
                <Textarea
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe what your project does…"
                  rows={4}
                />
                {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="github">GitHub Repository URL</Label>
                <Input
                  id="github"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/user/repo"
                />
                {errors.githubUrl && <p className="text-xs text-destructive">{errors.githubUrl}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Upload Prompts (PDF)</Label>
                <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground">
                  <Upload className="h-4 w-4" />
                  {pdfName ?? "Choose a PDF file…"}
                  <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                </label>
              </div>

              <div className="space-y-1.5">
                <Label>Key Features (drag to reorder by priority)</Label>
                <FeatureList features={features} onChange={setFeatures} />
                {errors.features && <p className="text-xs text-destructive">{errors.features}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {existing ? "Updating..." : "Submitting..."}
                  </>
                ) : (
                  existing ? "Update Project" : "Submit Project"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddProject;
