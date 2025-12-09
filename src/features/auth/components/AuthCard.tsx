import type { ReactNode } from "react";
import { Microscope } from "lucide-react";

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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <Microscope className="w-8 h-8 text-white" strokeWidth={2} />
          </div>
          <h1 className="brand-title text-5xl mb-2">
            <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent inline-block transform hover:scale-105 transition-transform duration-300">
              BioScope
            </span>
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent inline-block ml-1 transform hover:scale-105 transition-transform duration-300">
              AI
            </span>
          </h1>
          <p className="text-gray-600 text-sm">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
