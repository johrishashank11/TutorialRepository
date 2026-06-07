import React from 'react';
import { cn } from '../layout/DashboardLayout';

export const AppInput = ({ label, error, className, id, ...props }) => {
  return (
    <div className={className}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <input
        id={id}
        className={cn(
          "w-full border p-2.5 rounded-lg outline-none transition-shadow",
          error
            ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50/50"
            : "border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
};
