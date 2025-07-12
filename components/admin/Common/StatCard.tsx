import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  color?: string;
  loading?: boolean;
}

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = "text-[var(--legal-brown)]",
  loading = false 
}: StatCardProps) {
  return (
    <div className="bg-card rounded-lg p-4 sm:p-6 border border-border shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-muted-foreground text-xs sm:text-sm font-medium truncate">{title}</p>
          {loading ? (
            <div className="h-6 sm:h-8 w-16 sm:w-20 bg-muted animate-pulse rounded mt-1"></div>
          ) : (
            <p className={`text-lg sm:text-2xl font-bold ${color} font-montserrat mt-1`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          )}
          {trend && !loading && (
            <p className="text-xs text-muted-foreground mt-1 truncate">{trend}</p>
          )}
        </div>
        <div className="ml-3 sm:ml-4 flex-shrink-0">
          <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${color}`} />
        </div>
      </div>
    </div>
  );
}