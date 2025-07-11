// components/admin/Common/StatCard.tsx
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
    <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          {loading ? (
            <div className="h-8 w-20 bg-muted animate-pulse rounded mt-1"></div>
          ) : (
            <p className={`text-2xl font-bold ${color} font-montserrat`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          )}
          {trend && !loading && (
            <p className="text-xs text-muted-foreground mt-1">{trend}</p>
          )}
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </div>
  );
}