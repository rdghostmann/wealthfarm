import React from 'react';
import { Button } from './Button.js';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-[#DCE8DF] rounded-2xl bg-[#F8FAF9]">
      {icon && (
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#EEF7F0] text-[#176B3A] mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-[#17231C] mb-1.5">{title}</h3>
      <p className="text-sm text-neutral-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
