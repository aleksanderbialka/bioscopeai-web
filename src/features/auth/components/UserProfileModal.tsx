import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import type { User as UserType, UserUpdateMe } from "../types/auth.types";
import { Input } from "../../../components/Input";
import { Alert } from "../../../components/Alert";
import { ProfileModalLayout } from "./ProfileModalLayout";
import { useModalKeyboard } from "../hooks/useModalKeyboard";

interface UserProfileModalProps {
  user: UserType | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserUpdateMe) => Promise<void>;
}

export function UserProfileModal({ user, isOpen, onClose, onSave }: UserProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserUpdateMe>({
    email: "",
    first_name: "",
    last_name: "",
    institution: "",
    department: "",
    phone: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { modalRef, handleBackdropClick } = useModalKeyboard({
    isOpen,
    onClose,
    isEditing,
    isSubmitting,
    onCancel: () => {
      setIsEditing(false);
      setError(null);
      if (user) {
        setFormData({
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          institution: user.institution || "",
          department: user.department || "",
          phone: user.phone || "",
          password: "",
        });
      }
    },
  });

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        institution: user.institution || "",
        department: user.department || "",
        phone: user.phone || "",
        password: "",
      });
      setIsEditing(false);
      setError(null);
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      const updateData: UserUpdateMe = {};
      
      if (formData.email && formData.email !== user?.email) updateData.email = formData.email;
      if (formData.first_name && formData.first_name !== user?.first_name) updateData.first_name = formData.first_name;
      if (formData.last_name && formData.last_name !== user?.last_name) updateData.last_name = formData.last_name;
      if (formData.institution !== user?.institution) updateData.institution = formData.institution || null;
      if (formData.department !== user?.department) updateData.department = formData.department || null;
      if (formData.phone !== user?.phone) updateData.phone = formData.phone || null;
      if (formData.password) updateData.password = formData.password;

      await onSave(updateData);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    if (user) {
      setFormData({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        institution: user.institution || "",
        department: user.department || "",
        phone: user.phone || "",
        password: "",
      });
    }
  };

  return (
    <ProfileModalLayout
      isOpen={isOpen}
      user={user}
      title={isEditing ? "Edit Profile" : "User Profile"}
      subtitle={isEditing ? "Update your personal information" : "View your account information"}
      onClose={onClose}
      modalRef={modalRef}
      onBackdropClick={handleBackdropClick}
    >

          {error && <Alert variant="error">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label="First Name"
                  value={formData.first_name || ""}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                  disabled={!isEditing}
                />
                <Input
                  label="Last Name"
                  value={formData.last_name || ""}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Contact Information
              </h4>
              <Input
                label="Email Address"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={!isEditing}
              />
              <Input
                label="Phone Number (optional)"
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            {/* Organization Information Section */}
            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Organization
              </h4>
              <Input
                label="Institution (optional)"
                value={formData.institution || ""}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="Department (optional)"
                value={formData.department || ""}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            {/* Password Section - Only in Edit Mode */}
            {isEditing && (
              <div className="space-y-3 sm:space-y-4">
                <h4 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Change Password (optional)
                </h4>
                <Input
                  label="New Password"
                  type="password"
                  value={formData.password || ""}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Leave blank to keep current password"
                />
                {formData.password && formData.password.length > 0 && formData.password.length < 8 && (
                  <p className="text-xs sm:text-sm text-red-600">Password must be at least 8 characters</p>
                )}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 py-3 sm:py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || (!!formData.password && formData.password.length < 8)}
                    className="w-full sm:flex-1 py-3 sm:py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full sm:flex-1 py-3 sm:py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:flex-1 py-3 sm:py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 text-sm sm:text-base"
                  >
                    Close Profile
                  </button>
                </>
              )}
            </div>
          </form>
        </ ProfileModalLayout>
  );
}
