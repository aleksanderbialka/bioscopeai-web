import { BookOpen, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-4 px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <span>© {currentYear} BioscopeAI</span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-400">v{__APP_VERSION__}</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/docs"
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Docs</span>
          </a>
          <a
            href="mailto:support@bioscopeai.com"
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Support</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
