import { useEffect, useCallback, useRef } from "react";

interface UseModalKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export function useModalKeyboard({
  isOpen,
  onClose,
  isEditing = false,
  isSubmitting = false,
  onCancel,
}: UseModalKeyboardProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        if (isEditing && onCancel) {
          onCancel();
        } else {
          onClose();
        }
      }
    },
    [onClose, isEditing, isSubmitting, onCancel]
  );

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget && !isSubmitting) {
        onClose();
      }
    },
    [onClose, isSubmitting]
  );

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";

    const focusableElement = modalRef.current?.querySelector<HTMLElement>(
      'input, button, select, [href], textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusableElement?.focus();

    return () => {
      document.body.style.overflow = "";
      previousActiveElement.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, handleEscapeKey]);

  return { modalRef, handleBackdropClick };
}
