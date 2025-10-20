import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '../ui/sheet';
import Sidebar from './Sidebar';

export default function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <div className="py-4">
          <div className="px-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              💰 Finance Tracker
            </h2>
          </div>
          <Sidebar />
        </div>
      </SheetContent>
    </Sheet>
  );
}