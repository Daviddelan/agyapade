import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  Settings, 
  LogOut,
  User,
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useInactivityTimer } from '../../hooks/useInactivityTimer';

interface LayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  useInactivityTimer();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Upload, label: 'Upload', path: '/dashboard/upload' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="h-full flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-golden-600">Collateral App</h1>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-golden-50 
                         rounded-lg transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 
                       rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <div className="flex-1" />
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-500" />
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}