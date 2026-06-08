import React from 'react';
import { cn } from '../layout/DashboardLayout';

export const AppButton = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-brand-500 shadow-sm"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base"
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className, props.disabled && "opacity-50 cursor-not-allowed")}
      {...props}
    >
      {children}
    </button>
  );
};
