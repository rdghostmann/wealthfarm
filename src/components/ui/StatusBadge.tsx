import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'order' | 'task' | 'ticket' | 'payment' | 'availability' | 'default';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'default', className = '' }) => {
  const getStyle = () => {
    const s = status.toUpperCase();
    switch (s) {
      case 'AVAILABLE':
      case 'PAID':
      case 'COMPLETED':
      case 'APPROVED':
      case 'SUCCESS':
      case 'PUBLISHED':
      case 'RESOLVED':
        return {
          textColor: 'text-emerald-800',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          dot: 'bg-emerald-600',
        };
      case 'RESERVED':
      case 'PROCESSING':
      case 'UNDER_REVIEW':
      case 'IN_PROGRESS':
      case 'SUBMITTED':
      case 'PENDING_PAYMENT':
      case 'PENDING':
        return {
          textColor: 'text-amber-800',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          dot: 'bg-amber-600',
        };
      case 'SOLD_OUT':
      case 'CANCELLED':
      case 'REJECTED':
      case 'FAILED':
      case 'CLOSED':
      case 'RESUBMISSION_REQUIRED':
        return {
          textColor: 'text-rose-800',
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-200',
          dot: 'bg-rose-600',
        };
      case 'DRAFT':
      default:
        return {
          textColor: 'text-neutral-700',
          bgColor: 'bg-neutral-100',
          borderColor: 'border-neutral-200',
          dot: 'bg-neutral-500',
        };
    }
  };

  const style = getStyle();
  const formatText = (text: string) => {
    return text.replace(/_/g, ' ');
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border ${style.bgColor} ${style.borderColor} ${style.textColor} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      <span className="capitalize">{formatText(status)}</span>
    </span>
  );
};
