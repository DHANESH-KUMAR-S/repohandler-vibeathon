import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectContext } from "@/context/ProjectContext";
import { authApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, ArrowRight, Loader2, Sparkles, Users, Key, Mail, Copy, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ViewMode = "choice" | "generate" | "login";

const Landing = () => {
  const navigate = useNavigate();
  const { setSession } = useProjectContext();
  const { toast } = useToast();
  
  const [viewMode, setViewMode] = useState<ViewMode>("choice");
  const [loading, setLoading] = useState(false);
  
  // Generate Team ID form
  const [leaderEmail, setLeaderEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [existingTeamId, setExistingTeamId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Login form
  const [teamId, setTeamId] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ teamId?: string; email?: string }>({});

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Team ID copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the Team ID manually",
        variant: "destructive",
      });
    }
  };

  const handleGenerateTeam = async (ev: React.FormEvent) => {
    ev.preventDefault();
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leaderEmail)) {
      setEmailError("Enter a valid email address");
      return;
    }

    setLoading(true);
    setEmailError("");
    setExistingTeamId(null);
    
    try {
      const result = await authApi.generateTeam(leaderEmail);
      setSession({ teamId: result.teamId, email: result.email });
      
      toast({
        title: "Team Created! 🎉",
        description: (
          <div className="mt-2">
            <p className="font-semibold">Your Team ID: {result.teamId}</p>
            <p className="text-xs mt-1">Save this ID - you'll need it to access your project!</p>
          </div>
        ),
        duration: 8000,
      });
      
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error: any) {
      console.log("Error caught:", error); // Debug log
      console.log("Error detail:", error.detail); // Debug log
      
      // Check if it's a 409 conflict (team already exists)
      if (error.status === 409) {
        // The error.detail should contain the team info
        const detail = error.detail || error.message;
        
        if (detail && typeof detail === 'object' && detail.teamId) {
          setExistingTeamId(detail.teamId);
          setEmailError("");
        } else if (typeof detail === 'string') {
          // Try to parse if it's a JSON string
          try {
            const parsed = JSON.parse(detail);
            if (parsed.teamId) {
              setExistingTeamId(parsed.teamId);
              setEmailError("");
            }
          } catch {
            toast({
              title: "Team already exists",
              description: "This email already has a Team ID. Please check your email or contact support.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Team already exists",
            description: "This email already has a Team ID. Please check your email or contact support.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Failed to create team",
          description: error.message?.message || error.message || "Please try again",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUseExistingTeam = () => {
    if (existingTeamId) {
      setSession({ teamId: existingTeamId, email: leaderEmail });
      toast({
        title: "Welcome back! 👋",
        description: `Using existing Team ID: ${existingTeamId}`,
      });
      navigate("/dashboard");
    }
  };

  const handleLogin = async (ev: React.FormEvent) => {
    ev.preventDefault();
    
    const e: typeof errors = {};
    if (!teamId.trim() || teamId.trim().length < 3) e.teamId = "Enter a valid Team ID (min 3 chars)";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
    setErrors(e);
    
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    try {
      const result = await authApi.teamLogin({
        teamId: teamId.trim(),
        email: email.trim(),
      });
      setSession({ teamId: result.teamId, email: result.email });
      toast({
        title: "Welcome back! 👋",
        description: `Logged in as ${result.email}`,
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-accent/20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
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
        <motion.div
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card/50 px-4 py-2 text-sm font-medium text-muted-foreground shadow-lg backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Terminal className="h-4 w-4 text-primary" />
            Vibeathon 2026
            <Sparkles className="h-4 w-4 text-primary" />
          </motion.div>
          
          <motion.h1
            className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            REPO<span className="text-primary">HANDLER</span>
          </motion.h1>
          
          <motion.p
            className="mt-4 text-lg text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Submit &amp; manage your hackathon projects with ease
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {viewMode === "choice" && (
            <motion.div
              key="choice"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-4xl"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Generate Team ID Card */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card
                    className="group cursor-pointer border-2 border-dashed transition-all hover:border-primary hover:shadow-2xl hover:shadow-primary/20"
                    onClick={() => setViewMode("generate")}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg transition-transform group-hover:scale-110">
                        <Sparkles className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl">Generate Team ID</CardTitle>
                      <CardDescription className="mt-2">
                        New team? Create your unique Team ID instantly
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Perfect for team leaders
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Already Have Team ID Card */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card
                    className="group cursor-pointer border-2 transition-all hover:border-primary hover:shadow-2xl hover:shadow-primary/20"
                    onClick={() => setViewMode("login")}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent/60 shadow-lg transition-transform group-hover:scale-110">
                        <Key className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">Already Have Team ID</CardTitle>
                      <CardDescription className="mt-2">
                        Sign in with your existing Team ID
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <ArrowRight className="h-4 w-4" />
                        Quick access to your projects
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Admin Link */}
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={() => navigate("/admin/login")}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary hover:underline"
                >
                  Admin access →
                </button>
              </motion.div>
            </motion.div>
          )}

          {viewMode === "generate" && (
            <motion.div
              key="generate"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <Card className="border-2 shadow-2xl">
                <CardHeader>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>Generate Team ID</CardTitle>
                      <CardDescription>Enter team leader's email</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGenerateTeam} className="space-y-4">
                    {existingTeamId && (
                      <Alert className="border-primary/50 bg-primary/5">
                        <AlertCircle className="h-4 w-4 text-primary" />
                        <AlertDescription className="space-y-3">
                          <p className="text-sm font-medium">Team ID Already Exists!</p>
                          <p className="text-xs text-muted-foreground">
                            This email already has a Team ID. Use it to login:
                          </p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 rounded bg-secondary px-3 py-2 text-sm font-mono font-semibold">
                              {existingTeamId}
                            </code>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(existingTeamId)}
                              className="shrink-0"
                            >
                              {copied ? (
                                <>
                                  <Check className="h-4 w-4" />
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            className="w-full"
                            onClick={handleUseExistingTeam}
                          >
                            Continue with this Team ID
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="leaderEmail" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Team Leader Email
                      </Label>
                      <Input
                        id="leaderEmail"
                        type="email"
                        value={leaderEmail}
                        onChange={(e) => {
                          setLeaderEmail(e.target.value);
                          setExistingTeamId(null); // Clear existing team alert when email changes
                        }}
                        placeholder="leader@college.edu"
                        className="transition-all focus:ring-2 focus:ring-primary"
                        disabled={loading}
                      />
                      {emailError && <p className="text-xs text-destructive">{emailError}</p>}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setViewMode("choice");
                          setExistingTeamId(null);
                          setLeaderEmail("");
                        }}
                        disabled={loading}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Checking...
                          </>
                        ) : (
                          <>
                            Generate ID
                            <Sparkles className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {viewMode === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <Card className="border-2 shadow-2xl">
                <CardHeader>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/60">
                      <Key className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Team Login</CardTitle>
                      <CardDescription>Enter your credentials</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="teamId">Team ID</Label>
                      <Input
                        id="teamId"
                        value={teamId}
                        onChange={(e) => setTeamId(e.target.value)}
                        placeholder="TEAM-XXXXXXXX"
                        className="transition-all focus:ring-2 focus:ring-primary"
                        disabled={loading}
                      />
                      {errors.teamId && <p className="text-xs text-destructive">{errors.teamId}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@college.edu"
                        className="transition-all focus:ring-2 focus:ring-primary"
                        disabled={loading}
                      />
                      {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setViewMode("choice")}
                        disabled={loading}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging in...
                          </>
                        ) : (
                          <>
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Landing;
