import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import type { RegisterCredentials } from "../types/auth.types";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { Alert } from "../../../components/Alert";

interface RegisterFormData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSubmit: (credentials: RegisterCredentials) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export function RegisterForm({ onSubmit, isLoading = false, error }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setValidationError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    await onSubmit({
      email: formData.email,
      username: formData.username,
      first_name: formData.first_name,
      last_name: formData.last_name,
      password: formData.password,
    });
  };

  const displayError = validationError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {displayError && (
        <Alert variant="error">{displayError}</Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="first_name"
          name="first_name"
          type="text"
          label="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
          minLength={2}
          maxLength={50}
          disabled={isLoading}
          placeholder="John"
        />

        <Input
          id="last_name"
          name="last_name"
          type="text"
          label="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          required
          minLength={2}
          maxLength={50}
          disabled={isLoading}
          placeholder="Doe"
        />
      </div>

      <Input
        id="username"
        name="username"
        type="text"
        label="Username"
        value={formData.username}
        onChange={handleChange}
        required
        minLength={3}
        maxLength={50}
        disabled={isLoading}
        placeholder="johndoe"
      />

      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        value={formData.email}
        onChange={handleChange}
        required
        minLength={5}
        maxLength={100}
        disabled={isLoading}
        placeholder="john@example.com"
      />

      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        required
        minLength={8}
        maxLength={50}
        disabled={isLoading}
        placeholder="••••••••"
      />

      <Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        minLength={8}
        maxLength={50}
        disabled={isLoading}
        placeholder="••••••••"
      />

      <Button
        type="submit"
        disabled={isLoading}
        variant="primary"
        size="lg"
        className="w-full"
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
