import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../layout/DashboardLayout';

export const AppLoader = ({ fullScreen = false, size = 24, className }) => {
  const loader = <Loader2 size={size} className={cn("animate-spin text-brand-500", className)} />;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {loader}
      </div>
    );
  }
  return <div className="flex justify-center p-4">{loader}</div>;
};
