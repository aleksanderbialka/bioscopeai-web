import { Microscope } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  centered?: boolean;
}

export function Logo({ size = "md", showIcon = true, centered = false }: LogoProps) {
  const sizeClasses = {
    sm: {
      icon: "w-8 h-8",
      iconSize: "w-4 h-4",
      text: "text-2xl",
    },
    md: {
      icon: "w-10 h-10",
      iconSize: "w-5 h-5",
      text: "text-3xl",
    },
    lg: {
      icon: "w-16 h-16",
      iconSize: "w-8 h-8",
      text: "text-5xl",
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}>
      {showIcon && (
        <div className={`${classes.icon} bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
          <Microscope className={`${classes.iconSize} text-white`} strokeWidth={2} />
        </div>
      )}
      <h1 className={`brand-title ${classes.text}`}>
        <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
          BioScope
        </span>
        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent ml-1">
          AI
        </span>
      </h1>
    </div>
  );
}
