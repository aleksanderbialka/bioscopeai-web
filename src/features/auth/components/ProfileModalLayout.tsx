import type { ReactNode } from "react";
import { useEffect } from "react";
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
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto"
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
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-4 sm:my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] flex flex-col"
      >
        <div className="relative bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-16 sm:pb-20 md:pb-24 flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3 sm:top-4 md:top-6 right-3 sm:right-4 md:right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-blue-600"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="space-y-1 sm:space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{title}</h2>
            <p className="text-blue-100 text-xs sm:text-sm">{subtitle}</p>
          </div>
        </div>
        <div className="flex justify-center -mt-12 sm:-mt-14 md:-mt-16 mb-4 sm:mb-6 px-4 sm:px-6 md:px-8 flex-shrink-0">
          <div 
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl ring-4 ring-white relative"
            aria-hidden="true"
          >
            <User className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />
            <div className="absolute -bottom-2 -right-2">
              <Badge variant={getRoleBadgeVariant(user.role)}>
                <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5">
                  <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="font-semibold capitalize text-xs">{user.role}</span>
                </div>
              </Badge>
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          <div className="text-center space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              {user.first_name} {user.last_name}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">@{user.username}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
