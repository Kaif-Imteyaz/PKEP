import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, BarChart2, Home, BookOpen, ClipboardList, MessageSquare, ChevronDown, User, Bell, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Layout({ children, onViewChange }: { children: React.ReactNode; onViewChange: (view: string) => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('home');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  useEffect(() => {
    const fetchUserData = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserEmail(data.user.email || '');
        // Try to get a name from the metadata if available
        const metadata = data.user.user_metadata;
        const name = metadata?.full_name || metadata?.name || '';
        setUserName(name || 'Government Officer');
      }
    };
    
    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.reload();
    } catch (err) {
      console.error('Sign out failed:', err);
      window.location.reload();
    }
  };

  const handleViewChange = (viewId: string) => {
    setActiveView(viewId);
    onViewChange(viewId);
    setSidebarOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, description: 'Overview dashboard' },
    { id: 'dashboard', label: 'Service Metrics', icon: BarChart2, description: 'Performance analytics' },
    { id: 'reflection', label: 'Reflection Board', icon: ClipboardList, description: 'Meeting notes and insights' },
    { id: 'resources', label: 'Resource Hub', icon: BookOpen, description: 'Knowledge repository' },
    { id: 'whatsapp', label: 'WhatsApp Settings', icon: MessageSquare, description: 'Communication preferences' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Top navigation for mobile */}
      <header className="bg-white shadow-sm lg:hidden sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md p-1"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 flex justify-center">
            <h1 className="text-lg font-semibold text-primary-700">PKEP</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="text-neutral-500 hover:text-neutral-600 focus:outline-none"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell className="h-5 w-5" />
            </button>
            
            <button 
              className="text-neutral-500 hover:text-neutral-600 focus:outline-none"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-50">
        <div className="flex flex-col flex-grow bg-primary-700 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-white">PKEP</h1>
          </div>
          <div className="text-xs text-primary-50 px-4 mt-1">
            Peer Knowledge Exchange Platform
          </div>
          
          <div className="mt-8">
            <nav className="px-2 space-y-1">
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleViewChange(item.id)}
                  type="button"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full transition-all duration-200 cursor-pointer ${
                    activeView === item.id
                      ? 'bg-primary-600 text-white'
                      : 'text-primary-50 hover:bg-primary-600 hover:text-white'
                  }`}
                >
                  <item.icon 
                    className={`mr-3 h-5 w-5 transition-colors ${
                      activeView === item.id
                        ? 'text-white'
                        : 'text-primary-50 group-hover:text-white'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="flex-shrink-0 bg-primary-600 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-9 w-9 rounded-full bg-secondary-600 flex items-center justify-center text-white font-medium">
                {userName.charAt(0)}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{userName}</p>
              <p className="text-xs text-primary-50 truncate">{userEmail}</p>
            </div>
            <div className="ml-auto">
              <button 
                onClick={handleSignOut}
                className="text-primary-200 hover:text-white focus:outline-none transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-neutral-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-primary-700">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <h1 className="text-xl font-bold text-white">PKEP</h1>
              </div>
              <div className="text-xs text-primary-50 px-4 mt-1">
                Peer Knowledge Exchange Platform
              </div>
              
              <nav className="mt-8 px-2 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleViewChange(item.id)}
                    type="button"
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md w-full transition-all duration-200 cursor-pointer ${
                      activeView === item.id
                        ? 'bg-primary-600 text-white'
                        : 'text-primary-50 hover:bg-primary-600 hover:text-white'
                    }`}
                  >
                    <item.icon 
                      className={`mr-3 h-6 w-6 transition-colors ${
                        activeView === item.id
                          ? 'text-white'
                          : 'text-primary-50 group-hover:text-white'
                      }`}
                    />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="flex-shrink-0 bg-primary-600 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-9 w-9 rounded-full bg-secondary-600 flex items-center justify-center text-white font-medium">
                    {userName.charAt(0)}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{userName}</p>
                  <p className="text-xs text-primary-50 truncate">{userEmail}</p>
                </div>
                <div className="ml-auto">
                  <button 
                    onClick={handleSignOut}
                    className="text-primary-200 hover:text-white focus:outline-none transition-colors duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 w-14"></div>
        </div>
      )}
      
      {/* Header for desktop */}
      <div className="hidden lg:flex lg:flex-col lg:pl-64">
        <div className="sticky top-0 z-10 flex-shrink-0 h-16 bg-white shadow-sm flex">
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-bold text-primary-700">Peer Knowledge Exchange Platform</h1>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              <button
                className="p-1 rounded-full text-neutral-500 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell className="h-6 w-6" />
              </button>
              
              <div className="ml-3 relative">
                <div>
                  <button
                    className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-transform duration-200 hover:scale-105"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-medium">
                      {userName.charAt(0)}
                    </div>
                  </button>
                </div>
                
                {userMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                      <a href="#" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors duration-150">Your Profile</a>
                      <a href="#" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors duration-150">Settings</a>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors duration-150"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <main className="lg:pl-64 flex-1">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-auto lg:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">About</h3>
              <p className="mt-2 text-sm text-gray-600">
                A collaborative initiative to enhance public service delivery through peer learning and knowledge exchange.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Contact</h3>
              <div className="mt-2 text-sm text-gray-600">
                <p>Department of Governance Reforms</p>
                <p>Plot No. D-241, Industrial Area,</p>
                <p>Phase-8B, Sector - 74,</p>
                <p>Mohali - 160062</p>
                <a 
                  href="https://dgrpg.punjab.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 mt-2 inline-block"
                >
                  dgrpg.punjab.gov.in
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Support</h3>
              <div className="mt-2 text-sm text-gray-600">
                <p>Helpline: 0172-2970911</p>
                <p>Email: support@pkep.punjab.gov.in</p>
                <p className="mt-2">For technical assistance and feedback, please contact our support team.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-6 text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Peer Knowledge Exchange Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}