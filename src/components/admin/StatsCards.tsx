import { Users, Flame, UserCheck, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  totalLeads: number;
  hotLeads: number;
  contacted: number;
  enrolled: number;
}

export function StatsCards({ totalLeads, hotLeads, contacted, enrolled }: StatsCardsProps) {
  const stats = [
    {
      label: 'Total Leads',
      value: totalLeads,
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Hot Leads',
      value: hotLeads,
      icon: Flame,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
    {
      label: 'Sudah Dihubungi',
      value: contacted,
      icon: UserCheck,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Terdaftar',
      value: enrolled,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="glass rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className={`${stat.bg} p-2 rounded-lg`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
          <div className="text-2xl font-heading font-bold text-foreground">
            {stat.value}
          </div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
