import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Project, TeamSession } from "@/types/project";
import { authApi, getAuthToken } from "@/services/api";

interface ProjectContextType {
  session: TeamSession | null;
  setSession: (s: TeamSession | null) => void;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  getTeamProjects: () => Project[];
  isAuthenticated: boolean;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSessionState] = useState<TeamSession | null>(() => {
    const saved = localStorage.getItem("session");
    return saved ? JSON.parse(saved) : null;
  });
  const [projects, setProjects] = useState<Project[]>([]);

  const setSession = useCallback((s: TeamSession | null) => {
    setSessionState(s);
    if (s) {
      localStorage.setItem("session", JSON.stringify(s));
    } else {
      localStorage.removeItem("session");
      authApi.logout();
    }
  }, []);

  const addProject = useCallback((project: Project) => {
    setProjects((prev) => [...prev, project]);
  }, []);

  const updateProject = useCallback((project: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getTeamProjects = useCallback(() => {
    if (!session) return [];
    return projects.filter((p) => p.teamId === session.teamId);
  }, [session, projects]);

  const isAuthenticated = !!session && !!getAuthToken();

  return (
    <ProjectContext.Provider
      value={{
        session,
        setSession,
        projects,
        setProjects,
        addProject,
        updateProject,
        deleteProject,
        getTeamProjects,
        isAuthenticated,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProjectContext must be used within ProjectProvider");
  return ctx;
};
