import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { User, Shield, X } from "lucide-react";
import type { User as UserType } from "../types/auth.types";
import { Badge } from "../../../components/Badge";

interface ProfileModalLayoutProps {
  isOpen: boolean;
  user: UserType | null;
  title: string;
  subtitle: string;
  onClose: () => void;
  modalRef: React.RefObject<HTMLDivElement | null>;
  onBackdropClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  children: ReactNode;
}

const ROLE_BADGE_VARIANTS = {
  admin: "danger",
  researcher: "warning",
  analyst: "info",
  viewer: "neutral",
} as const;

function getRoleBadgeVariant(role: string): "danger" | "warning" | "info" | "neutral" {
  const normalizedRole = role.toLowerCase();
  return ROLE_BADGE_VARIANTS[normalizedRole as keyof typeof ROLE_BADGE_VARIANTS] ?? "info";
}

export function ProfileModalLayout({
  isOpen,
  user,
  title,
  subtitle,
  onClose,
  modalRef,
  onBackdropClick,
  children,
}: ProfileModalLayoutProps) {
  if (!isOpen || !user) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onBackdropClick}
    >
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />
      
      <div 
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="relative bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 px-8 pt-8 pb-24">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-blue-600"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">{title}</h2>
            <p className="text-blue-100 text-sm">{subtitle}</p>
          </div>
        </div>
        <div className="flex justify-center -mt-16 mb-6 px-8">
          <div 
            className="w-28 h-28 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl ring-4 ring-white relative"
            aria-hidden="true"
          >
            <User className="w-14 h-14" />
            <div className="absolute -bottom-2 -right-2">
              <Badge variant={getRoleBadgeVariant(user.role)}>
                <div className="flex items-center gap-1.5 px-3 py-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span className="font-semibold capitalize text-xs">{user.role}</span>
                </div>
              </Badge>
            </div>
          </div>
        </div>
        <div className="px-8 pb-8 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">
              {user.first_name} {user.last_name}
            </h3>
            <p className="text-gray-600 text-base">@{user.username}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
