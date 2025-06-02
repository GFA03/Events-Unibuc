import { TrendingUp } from 'lucide-react';

export default function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  trend
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  subtitle?: string;
  trend?: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center mt-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              {trend}
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-full">
          <Icon className="h-8 w-8 text-blue-600" />
        </div>
      </div>
    </div>
  );
}
