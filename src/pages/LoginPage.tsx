import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { AuthCard } from "../features/auth/components/AuthCard";
import { LoginForm } from "../features/auth/components/LoginForm";
import type { LoginCredentials } from "../features/auth/types/auth.types";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (credentials: LoginCredentials) => {
    setError("");
    setIsLoading(true);

    try {
      await login(credentials);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard subtitle="Sign in to your account">
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
      
      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-sky-600 hover:text-sky-700 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

export default LoginPage;
