import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
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
  { title: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { title: 'Transactions', icon: ArrowLeftRight, href: '/transactions' },
  { title: 'Categories', icon: Tags, href: '/categories' },
  { title: 'Budgets', icon: PiggyBank, href: '/budgets' },
  // { title: 'Reports', icon: Receipt, href: '/reports' },
  // { title: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar({ className }: SidebarProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <div
        className={cn(
          'min-h-screen bg-white border-r border-neutral-200 flex flex-col',
          className
        )}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-neutral-200">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-xl">
            💰
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col items-center py-8 gap-2">
          {menuItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'w-11 h-11 flex items-center justify-center rounded-xl transition-colors',
                      isActive
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100'
                    )
                  }
                >
                  <item.icon className="w-5 h-5" strokeWidth={1.5} />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-neutral-900 text-white border-neutral-900 text-sm font-medium"
              >
                {item.title}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        {/* Version */}
        <div className="pb-6 text-center">
          <span className="text-[10px] text-neutral-400 font-medium tracking-wider">
            v1.0
          </span>
        </div>
      </div>
    </TooltipProvider>
  );
}