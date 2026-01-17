import { TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple" | "orange";
}

const colorStyles = {
  blue: {
    bg: "bg-blue-50",
    iconBg: "bg-blue-500",
    text: "text-blue-700",
  },
  green: {
    bg: "bg-green-50",
    iconBg: "bg-green-500",
    text: "text-green-700",
  },
  purple: {
    bg: "bg-purple-50",
    iconBg: "bg-purple-500",
    text: "text-purple-700",
  },
  orange: {
    bg: "bg-orange-50",
    iconBg: "bg-orange-500",
    text: "text-orange-700",
  },
};

export function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  const styles = colorStyles[color];

  return (
    <div className={`${styles.bg} rounded-xl p-6 shadow-sm border border-gray-200/50`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className={`text-sm ${styles.text} flex items-center gap-1`}>
              <TrendingUp className="w-4 h-4" />
              {subtitle}
            </p>
          )}
        </div>
        <div className={`${styles.iconBg} p-3 rounded-lg text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
