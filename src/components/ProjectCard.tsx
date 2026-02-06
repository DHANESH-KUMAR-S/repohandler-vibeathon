import { ExternalLink, FileText, List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  onView?: () => void;
  onEdit?: () => void;
  showTeam?: boolean;
}

const ProjectCard = ({ project, onView, onEdit, showTeam }: ProjectCardProps) => (
  <Card className="group cursor-pointer transition-shadow hover:shadow-md" onClick={onView}>
    <CardHeader className="pb-2">
      <div className="flex items-start justify-between gap-2">
        <CardTitle className="text-base leading-tight">{project.name}</CardTitle>
        {showTeam && (
          <Badge variant="secondary" className="shrink-0 text-[10px]">
            {project.teamId}
          </Badge>
        )}
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>

      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 transition-colors hover:text-foreground"
        >
          <ExternalLink className="h-3 w-3" /> GitHub
        </a>
        {project.promptPdfName && project.promptPdfUrl && (
          <a
            href={project.promptPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 transition-colors hover:text-foreground"
            title="View PDF"
          >
            <FileText className="h-3 w-3" /> PDF
          </a>
        )}
        {project.promptPdfName && !project.promptPdfUrl && (
          <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1">
            <FileText className="h-3 w-3" /> PDF attached
          </span>
        )}
        <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1">
          <List className="h-3 w-3" /> {project.features.length} features
        </span>
      </div>

      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="text-xs font-medium text-primary hover:underline"
        >
          Edit project
        </button>
      )}
    </CardContent>
  </Card>
);

export default ProjectCard;
