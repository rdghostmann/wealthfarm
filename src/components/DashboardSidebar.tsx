import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  CreditCard,
  CheckSquare,
  GraduationCap,
  LifeBuoy,
  User,
  Shield,
  Bell,
  LogOut,
  Users,
  Layers,
  FileCheck,
  Settings,
  FileText
} from 'lucide-react';

interface DashboardSidebarProps {
  currentPath: string;
  navigate: (path: string) => void;
  isAdmin?: boolean;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ currentPath, navigate, isAdmin }) => {
  const { user, logout } = useAuth();

  const userItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Orders', path: '/dashboard/orders', icon: ShoppingBag },
    { label: 'Transactions', path: '/dashboard/transactions', icon: CreditCard },
    { label: 'Field Tasks', path: '/dashboard/tasks', icon: CheckSquare },
    { label: 'Academy & Courses', path: '/dashboard/learning', icon: GraduationCap },
    { label: 'Support Desk', path: '/dashboard/support', icon: LifeBuoy },
    { label: 'Notifications', path: '/dashboard/notifications', icon: Bell },
    { label: 'Profile & Security', path: '/dashboard/profile', icon: User },
  ];

  const adminItems = [
    { label: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'Manage Products', path: '/admin/products', icon: Package },
    { label: 'Order Processing', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Payments & Paystack', path: '/admin/payments', icon: CreditCard },
    { label: 'Field Tasks Registry', path: '/admin/tasks', icon: CheckSquare },
    { label: 'Review Submissions', path: '/admin/submissions', icon: FileCheck },
    { label: 'Academy Curriculum', path: '/admin/courses', icon: GraduationCap },
    { label: 'Support Queue', path: '/admin/support', icon: LifeBuoy },
    { label: 'Site Content', path: '/admin/content', icon: FileText },
    { label: 'Platform Settings', path: '/admin/settings', icon: Settings },
  ];

  const items = isAdmin ? adminItems : userItems;

  return (
    <aside className="w-full md:w-64 bg-white border-r border-[#DCE8DF] shrink-0 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {/* User Card */}
        <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#DCE8DF]">
          <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-600 mb-1">
            {isAdmin ? 'ADMINISTRATIVE CONTROL' : 'MEMBER ACCOUNT'}
          </div>
          <div className="font-bold text-sm text-[#17231C] truncate">{user?.name}</div>
          <div className="text-xs text-neutral-500 truncate">{user?.email}</div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium text-emerald-800">
              {user?.role === 'ADMIN' ? 'Authorized Directorate' : 'Verified Member'}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left ${
                  isActive
                    ? 'bg-[#EEF7F0] text-[#176B3A] font-bold shadow-xs'
                    : 'text-neutral-600 hover:text-[#17231C] hover:bg-neutral-50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#176B3A]' : 'text-neutral-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Role toggle button */}
        {user?.role === 'ADMIN' && (
          <div className="pt-2 border-t border-neutral-100">
            {isAdmin ? (
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-neutral-600 hover:text-[#176B3A] rounded-lg hover:bg-neutral-50"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Return to Member View</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#176B3A] bg-[#EEF7F0] rounded-lg hover:bg-[#DEEFE2]"
              >
                <Shield className="w-4 h-4" />
                <span>Switch to Admin View</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Logout footer */}
      <div className="p-4 border-t border-[#DCE8DF]">
        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
