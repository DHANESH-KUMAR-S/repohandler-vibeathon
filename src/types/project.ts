export interface Feature {
  id: string;
  text: string;
}

export interface TeamMember {
  id: string;
  name: string;
}

export interface ProjectBase {
  teamName: string;
  name: string;
  description: string;
  githubUrl: string;
  features: Feature[];
  teamMembers: TeamMember[];
}

export interface ProjectCreate extends ProjectBase {}

export interface ProjectUpdate extends ProjectBase {}

export interface Project {
  id: string;
  teamId: string;
  email: string;
  teamName?: string;  // Optional for backward compatibility
  name: string;
  description: string;
  githubUrl: string;
  features: Feature[];
  teamMembers?: TeamMember[];  // Optional for backward compatibility
  promptPdfName: string | null;
  promptPdfUrl?: string | null;
  submittedAt: string;
}

export interface TeamSession {
  teamId: string;
  email: string;
}
