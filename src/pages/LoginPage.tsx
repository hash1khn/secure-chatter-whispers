
import AuthForm from "@/components/auth/AuthForm";

interface LoginPageProps {
  onAuthenticated: (userData: { username: string; id: string }) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onAuthenticated }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Secure Chat</h1>
          <p className="text-muted-foreground">
            End-to-end encrypted messaging platform
          </p>
        </div>
        <AuthForm onAuthenticated={onAuthenticated} />
      </div>
    </div>
  );
};

export default LoginPage;
