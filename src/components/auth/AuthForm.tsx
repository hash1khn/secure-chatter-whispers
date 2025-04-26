
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { useToast } from "@/components/ui/sonner";

type AuthMode = "login" | "register";

interface AuthFormProps {
  onAuthenticated: (userData: { username: string; id: string }) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (mode === "register" && password !== confirmPassword) {
      toast("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate authentication - in a real app, this would call an API
      setTimeout(() => {
        // Mock successful authentication
        const userData = {
          username,
          id: `user-${Math.floor(Math.random() * 10000)}`,
        };

        localStorage.setItem("secureChat_user", JSON.stringify(userData));
        onAuthenticated(userData);
        
        toast("Authentication successful!");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Authentication error:", error);
      toast("Authentication failed. Please try again.");
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <Card className="w-[350px] shadow-lg bg-card border-border/50">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-2 rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Secure Chat</CardTitle>
        <CardDescription>
          {mode === "login" ? "Sign in to your account" : "Create a new account"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : mode === "login" ? "Sign In" : "Sign Up"}
          </Button>
          <Button 
            type="button" 
            variant="link" 
            onClick={toggleMode}
            className="text-sm text-primary"
          >
            {mode === "login"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;
