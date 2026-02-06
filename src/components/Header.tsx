import { useNavigate, useLocation } from "react-router-dom";
import { useProjectContext } from "@/context/ProjectContext";
import { Button } from "@/components/ui/button";
import { LogOut, Terminal } from "lucide-react";

const Header = () => {
  const { session, setSession } = useProjectContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <button onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")} className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold tracking-tight text-foreground">REPOHANDLER</span>
          <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground">
            Vibeathon
          </span>
        </button>
        {(session || isAdmin) && (
          <div className="flex items-center gap-3">
            {session && (
              <span className="hidden text-xs text-muted-foreground sm:inline">{session.email}</span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSession(null);
                navigate("/");
              }}
            >
              <LogOut className="mr-1 h-3.5 w-3.5" />
              Exit
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
