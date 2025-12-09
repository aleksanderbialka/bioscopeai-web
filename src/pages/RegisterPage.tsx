import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { AuthCard } from "../features/auth/components/AuthCard";
import { RegisterForm } from "../features/auth/components/RegisterForm";
import type { RegisterCredentials } from "../features/auth/types/auth.types";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRegister = async (credentials: RegisterCredentials) => {
    setError("");
    setIsLoading(true);

    try {
      await register(credentials);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard subtitle="Create your account">
      <RegisterForm onSubmit={handleRegister} isLoading={isLoading} error={error} />
      
      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-sky-600 hover:text-sky-700 font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

export default RegisterPage;

