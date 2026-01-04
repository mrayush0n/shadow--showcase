
import React from 'react';
import type { Page } from '../types';
import { Icon } from './Icon';
import { auth } from '../firebase';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useAuth } from '../context/AuthContext';



interface SidebarProps {
  pages: Page[];
  activePageId: string;
  setActivePageId: (id: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ pages, activePageId, setActivePageId, isOpen, setIsOpen }) => {
  const { user, isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handleNavigation = (pageId: string) => {
    setActivePageId(pageId);
    setIsOpen(false);
  };

  const visiblePages = pages.filter(p => !p.hidden);

  // Features that are coming soon (not yet active) - Admins bypass this
  const comingSoonPages = isAdmin ? [] : [
    'musicStudio', 'threeDStudio', 'documentChat', 'agentBuilder', 'gallery', 'promptMarket', 'canvas',
    'podcastStudio', 'dataInsights',
    // Wave 2 & 3
    'presentationBuilder', 'emailComposer', 'avatarStudio', 'resumeBuilder', 'seoOptimizer',
    'meetingNotes', 'aiTutor', 'productPhoto',
    'socialMedia', 'aiTranslator', 'storyWriter', 'fitnessCoach', 'memeGenerator'
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 lg:hidden transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 
        bg-white/95 dark:bg-slate-900/95 
        backdrop-blur-2xl 
        border-r border-slate-200/80 dark:border-slate-700/50
        shadow-xl dark:shadow-2xl
        flex flex-col 
        transform transition-all duration-300 ease-out 
        lg:translate-x-0 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="relative">
              <img src="/app-logo.png" alt="Shadow Showcase" className="w-11 h-11 rounded-xl shadow-lg shadow-aurora-500/30 object-cover" />
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-aurora-500 to-rose-500 blur-lg opacity-40 -z-10" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-aurora-600 via-rose-600 to-aurora-600 dark:from-aurora-400 dark:via-rose-400 dark:to-aurora-400 bg-clip-text text-transparent">
                Shadow Showcase
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Powered by Shadow SI</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Tools
          </p>
          {visiblePages.map(page => {
            const isActive = activePageId === page.id;
            const isComingSoon = comingSoonPages.includes(page.id);
            return (
              <button
                key={page.id}
                onClick={() => !isComingSoon && handleNavigation(page.id)}
                disabled={isComingSoon}
                className={`
                  group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
                  text-left font-medium text-sm
                  transition-all duration-200
                  ${isComingSoon
                    ? 'opacity-60 cursor-not-allowed'
                    : ''
                  }
                  ${isActive && !isComingSoon
                    ? 'bg-gradient-to-r from-aurora-500 to-rose-500 text-white shadow-lg shadow-aurora-500/25'
                    : isComingSoon
                      ? 'text-slate-400 dark:text-slate-500'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
                  }
                `}
              >
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center
                  transition-all duration-200
                  ${isActive && !isComingSoon
                    ? 'bg-white/20'
                    : isComingSoon
                      ? 'bg-slate-200 dark:bg-slate-700 grayscale'
                      : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-aurora-100 dark:group-hover:bg-aurora-900/30 group-hover:text-aurora-600 dark:group-hover:text-aurora-400'
                  }
                `}>
                  <Icon name={page.icon} className="text-lg" />
                </div>
                <span className="flex-1">{page.name}</span>
                {isComingSoon ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full">
                    Soon
                  </span>
                ) : isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 space-y-3">
          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* User Profile */}
          {user && (
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
              <button
                onClick={() => handleNavigation('profile')}
                className="flex-1 flex items-center gap-3 rounded-lg hover:bg-white dark:hover:bg-slate-800 p-2 transition-colors group min-w-0"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=6366f1&color=fff`}
                    alt="User Avatar"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-aurora-500 transition-all"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                </div>
                <div className="flex-1 text-left overflow-hidden min-w-0">
                  <p className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                    {user.displayName || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 truncate">{user.email}</p>
                </div>
              </button>

              {/* Security Button */}
              <button
                onClick={() => handleNavigation('security')}
                className="flex-shrink-0 p-2.5 rounded-xl bg-aurora-50 dark:bg-aurora-950/30 text-aurora-500 dark:text-aurora-400 hover:bg-aurora-100 dark:hover:bg-aurora-900/50 transition-colors"
                title="Security Settings"
              >
                <Icon name="shield" className="text-lg" />
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex-shrink-0 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                title="Logout"
              >
                <Icon name="logout" className="text-lg" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
