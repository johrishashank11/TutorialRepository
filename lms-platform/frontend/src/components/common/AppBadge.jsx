import React from 'react';
import { cn } from '../layout/DashboardLayout';

export const AppBadge = ({ children, status = 'default', className }) => {
  const statuses = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    default: "bg-gray-100 text-gray-700 border-gray-200",
    brand: "bg-brand-50 text-brand-700 border-brand-200"
  };

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border", statuses[status], className)}>
      {children}
    </span>
  );
};
