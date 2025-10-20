import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 border-r border-slate-200 bg-white fixed left-0 top-0 h-full">
          <div className="p-6 border-b border-slate-200">
            <h1 className="text-xl font-bold text-slate-900">
              💰 Finance Tracker
            </h1>
          </div>
          <Sidebar />
        </aside>

        {/* Main Content */}
        <div className="flex-1 md:ml-64">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
            <div className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <MobileSidebar />
                  <h2 className="text-xl font-bold text-slate-900 md:hidden">
                    💰 Finance
                  </h2>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-600 text-white text-sm">
                          {user?.full_name ? getInitials(user.full_name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline text-sm font-medium">
                        {user?.full_name}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled>
                      <User className="mr-2 h-4 w-4" />
                      <span className="text-sm truncate">{user?.email}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}