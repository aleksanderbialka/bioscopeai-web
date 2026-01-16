import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import type { User as UserType, UserUpdateAdmin } from "../types/auth.types";
import { Input } from "../../../components/Input";
import { Alert } from "../../../components/Alert";
import { ProfileModalLayout } from "./ProfileModalLayout";
import { useModalKeyboard } from "../hooks/useModalKeyboard";

interface EditUserModalProps {
  user: UserType | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, data: UserUpdateAdmin) => Promise<void>;
}

export function EditUserModal({ user, isOpen, onClose, onSave }: EditUserModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserUpdateAdmin>({
    email: "",
    first_name: "",
    last_name: "",
    institution: "",
    department: "",
    phone: "",
    password: "",
    role: "viewer",
    status: "active",
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
          role: user.role,
          status: user.status || "active",
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
        role: user.role,
        status: user.status || "active",
      });
      setIsEditing(false);
      setError(null);
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const updateData: UserUpdateAdmin = {};
      
      if (formData.email && formData.email !== user?.email) updateData.email = formData.email;
      if (formData.first_name && formData.first_name !== user?.first_name) updateData.first_name = formData.first_name;
      if (formData.last_name && formData.last_name !== user?.last_name) updateData.last_name = formData.last_name;
      if (formData.institution !== user?.institution) updateData.institution = formData.institution || null;
      if (formData.department !== user?.department) updateData.department = formData.department || null;
      if (formData.phone !== user?.phone) updateData.phone = formData.phone || null;
      if (formData.role !== user?.role) updateData.role = formData.role;
      if (formData.status !== user?.status) updateData.status = formData.status;

      await onSave(user.id, updateData);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
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
        role: user.role,
        status: user.status || "active",
      });
    }
  };

  return (
    <ProfileModalLayout
      isOpen={isOpen}
      user={user}
      title={isEditing ? "Edit User" : "User Details"}
      subtitle={isEditing ? "Modify user information and permissions" : "View user information"}
      onClose={onClose}
      modalRef={modalRef}
      onBackdropClick={handleBackdropClick}
    >

          {error && <Alert variant="error">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Personal Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
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
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
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

            {/* Admin Controls - Role & Status */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Permissions & Status
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role || "viewer"}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserType["role"] })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  >
                    <option value="admin">Admin</option>
                    <option value="researcher">Researcher</option>
                    <option value="analyst">Analyst</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status || "active"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as UserType["status"] })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                    className="flex-1 py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 flex items-center justify-center gap-2"
                  >
                    <Edit className="w-5 h-5" />
                    Edit User
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </form>
        </ProfileModalLayout>
  );
}
