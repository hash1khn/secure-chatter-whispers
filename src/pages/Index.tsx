
import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import ChatPage from "./ChatPage";
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  const [currentUser, setCurrentUser] = useState<{ username: string; id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const storedUser = localStorage.getItem("secureChat_user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("secureChat_user");
      }
    }
    setIsLoading(false);
  }, []);

  const handleAuthenticated = (userData: { username: string; id: string }) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("secureChat_user");
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading secure environment...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentUser ? (
        <ChatPage currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <LoginPage onAuthenticated={handleAuthenticated} />
      )}
      <Toaster />
    </>
  );
};

export default Index;
