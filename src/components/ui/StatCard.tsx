import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subtext, icon, trend }) => {
  return (
    <div className="bg-white border border-[#DCE8DF] rounded-xl p-5 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-center justify-between text-neutral-500 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600">{label}</span>
        {icon && <div className="text-[#176B3A]">{icon}</div>}
      </div>
      <div className="text-2xl font-bold tracking-tight text-[#17231C] tabular-nums">
        {value}
      </div>
      {(subtext || trend) && (
        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
          {trend && (
            <span
              className={`font-medium ${
                trend.isPositive ? 'text-emerald-700' : 'text-neutral-600'
              }`}
            >
              {trend.value}
            </span>
          )}
          {subtext && <span>{subtext}</span>}
        </div>
      )}
    </div>
  );
};
