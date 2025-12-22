import type { ReactNode } from "react";
import { Logo } from "../../../components/Logo";

interface AuthCardProps {
  subtitle: string;
  children: ReactNode;
}

export function AuthCard({ subtitle, children }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Card */}
      <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20 animate-[fadeIn_0.5s_ease-out]">
        {/* Logo */}
        <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
          <Logo size="lg" showIcon={true} centered={true} />
          <p className="text-gray-600 text-sm mt-4 text-center">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
