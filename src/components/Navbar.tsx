import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Button } from './ui/Button.js';
import { Sprout, User, Shield, LogOut, Menu, X, Bell } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, logout, quickSwitch } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Ecosystem', path: '/ecosystem' },
    { label: 'Products', path: '/products' },
    { label: 'Learning', path: '/learning' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DCE8DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <button
            type="button"
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 text-left text-lg font-extrabold tracking-tight text-[#17231C] whitespace-nowrap shrink-0 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#176B3A] text-white flex items-center justify-center transition-transform group-hover:scale-105">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="font-sans">WEALTHFARM</span>
          </button>

          {/* Zone 2: 4-5 single-line clean nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => handleNav(link.path)}
                  className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'text-[#176B3A] font-semibold border-b-2 border-[#176B3A] py-1'
                      : 'hover:text-[#17231C]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary action / profile */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {user ? (
              <div className="relative">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleNav('/dashboard/notifications')}
                    className="p-2 text-neutral-500 hover:text-[#176B3A] rounded-lg hover:bg-neutral-100 transition-colors relative"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 py-1.5 px-3 rounded-lg border border-[#DCE8DF] bg-neutral-50 hover:bg-neutral-100 transition-colors text-xs font-semibold text-[#17231C]"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#EEF7F0] text-[#176B3A] flex items-center justify-center">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span className="max-w-[120px] truncate">{user.name}</span>
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-700">
                      {user.role}
                    </span>
                  </button>
                </div>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-[#DCE8DF] shadow-xl py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <div className="font-bold text-[#17231C] truncate">{user.name}</div>
                      <div className="text-neutral-500 truncate text-[11px]">{user.email}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNav('/dashboard')}
                      className="w-full text-left px-4 py-2 hover:bg-[#EEF7F0] hover:text-[#176B3A] font-medium transition-colors"
                    >
                      Member Dashboard
                    </button>
                    {user.role === 'ADMIN' && (
                      <button
                        type="button"
                        onClick={() => handleNav('/admin')}
                        className="w-full text-left px-4 py-2 hover:bg-[#EEF7F0] hover:text-[#176B3A] font-medium transition-colors flex items-center justify-between"
                      >
                        <span>Admin Control Centre</span>
                        <Shield className="w-3.5 h-3.5 text-[#176B3A]" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleNav('/dashboard/orders')}
                      className="w-full text-left px-4 py-2 hover:bg-[#EEF7F0] hover:text-[#176B3A] transition-colors"
                    >
                      Orders & Invoices
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav('/dashboard/tasks')}
                      className="w-full text-left px-4 py-2 hover:bg-[#EEF7F0] hover:text-[#176B3A] transition-colors"
                    >
                      Field Tasks
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav('/dashboard/learning')}
                      className="w-full text-left px-4 py-2 hover:bg-[#EEF7F0] hover:text-[#176B3A] transition-colors"
                    >
                      My Courses
                    </button>

                    {/* Quick Demo Role Switcher for seamless evaluation */}
                    <div className="my-1 border-t border-neutral-100 pt-1">
                      <div className="px-4 py-1 text-[10px] uppercase font-semibold text-neutral-400">
                        Demo Role Switch
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          await quickSwitch(user.role === 'ADMIN' ? 'USER' : 'ADMIN');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-1.5 text-neutral-600 hover:text-[#176B3A] hover:bg-neutral-50"
                      >
                        Switch to {user.role === 'ADMIN' ? 'Investor (USER)' : 'Director (ADMIN)'}
                      </button>
                    </div>

                    <div className="border-t border-neutral-100 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          handleNav('/login');
                        }}
                        className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleNav('/login')}
                  className="text-xs font-semibold text-neutral-700 hover:text-[#176B3A] px-3 py-2 transition-colors"
                >
                  Sign In
                </button>
                <Button variant="primary" size="sm" onClick={() => handleNav('/register')}>
                  Open Account
                </Button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-700 hover:text-[#176B3A] rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#DCE8DF] bg-white px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                type="button"
                onClick={() => handleNav(link.path)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  currentPath === link.path
                    ? 'bg-[#EEF7F0] text-[#176B3A] font-semibold'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-neutral-200">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-2 rounded-lg bg-neutral-50 text-xs">
                  <div className="font-bold text-[#17231C]">{user.name}</div>
                  <div className="text-neutral-500">{user.email} · {user.role}</div>
                </div>
                <Button variant="secondary" size="sm" className="w-full justify-start" onClick={() => handleNav('/dashboard')}>
                  Member Dashboard
                </Button>
                {user.role === 'ADMIN' && (
                  <Button variant="secondary" size="sm" className="w-full justify-start" onClick={() => handleNav('/admin')}>
                    Admin Control Centre
                  </Button>
                )}
                <Button variant="outline" size="sm" className="w-full text-rose-600 border-rose-200 justify-start" onClick={logout}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => handleNav('/login')}>
                  Sign In
                </Button>
                <Button variant="primary" size="sm" onClick={() => handleNav('/register')}>
                  Open Account
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
