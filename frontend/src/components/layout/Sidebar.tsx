import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  PiggyBank,
  Settings,
  Receipt,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: 'Transactions',
    icon: ArrowLeftRight,
    href: '/transactions',
  },
  {
    title: 'Categories',
    icon: Tags,
    href: '/categories',
  },
  {
    title: 'Budgets',
    icon: PiggyBank,
    href: '/budgets',
  },
  // {
  //   title: 'Reports',
  //   icon: Receipt,
  //   href: '/reports',
  // },
  // {
  //   title: 'Settings',
  //   icon: Settings,
  //   href: '/settings',
  // },
];

export default function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn('pb-12 min-h-screen', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:bg-slate-100',
                    isActive && 'bg-slate-100 text-blue-600 font-medium'
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}