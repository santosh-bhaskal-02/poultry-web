import React from "react";

/**
 * SummaryCard — a reusable metric card for dashboard or reports.
 * You can pass custom color, icon, and subtitle.

*/

export interface SummaryCardProps {
  title: string;
  value: number | string;
  color?: string; // optional, default gray
  icon?: React.ReactNode; // optional icon (e.g., lucide-react)
  subtitle?: string; // optional subtitle below title
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  color = "bg-gray-500",
  icon,
  subtitle,
}) => {
  return (
    <div
      className={`${color} text-white font-semibold rounded-xl p-4 flex flex-col justify-between shadow-md transition-transform duration-150 hover:scale-[1.03]`}>
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg">{title}</h2>
        {icon && <div className="text-white/80">{icon}</div>}
      </div>

      <span className="text-2xl font-bold">{value}</span>

      {subtitle && (
        <span className="text-sm font-normal text-white/90 mt-1">{subtitle}</span>
      )}
    </div>
  );
};

export default SummaryCard;
