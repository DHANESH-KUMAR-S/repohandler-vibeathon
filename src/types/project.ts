export interface Feature {
  id: string;
  text: string;
}

export interface ProjectBase {
  name: string;
  description: string;
  githubUrl: string;
  features: Feature[];
}

export interface ProjectCreate extends ProjectBase {}

export interface ProjectUpdate extends ProjectBase {}

export interface Project extends ProjectBase {
  id: string;
  teamId: string;
  email: string;
  promptPdfName: string | null;
  promptPdfUrl?: string | null;
  submittedAt: string;
}

export interface TeamSession {
  teamId: string;
  email: string;
}
