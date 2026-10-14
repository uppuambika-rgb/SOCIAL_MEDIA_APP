import React from 'react';
import { ViewMode, IUser } from '../types';
import { Avatar } from './Avatar';
import { Plus } from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  currentUser: IUser;
  allUsers: IUser[];
  onSwitchUser: (user: IUser) => void;
  onOpenCreateModal: () => void;
  onViewProfile: (userId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  currentUser,
  allUsers,
  onSwitchUser,
  onOpenCreateModal,
  onViewProfile
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#07090e]/85 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single element brand wordmark */}
        <button
          onClick={() => onSelectView('feed')}
          className="group flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-violet-600 to-fuchsia-500 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.35)] group-hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] transition-shadow">
            <span className="font-['Outfit'] font-black text-white text-base tracking-tighter">NV</span>
          </div>
          <span className="font-['Outfit'] font-extrabold text-xl tracking-tight text-white group-hover:text-cyan-300 transition-colors">
            NEON<span className="text-cyan-400">VOX</span>
          </span>
        </button>

        {/* Zone 2: Concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => onSelectView('feed')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              currentView === 'feed'
                ? 'text-cyan-300 border-cyan-400 font-semibold drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Live Feed
          </button>

          <button
            onClick={() => onSelectView('explore')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              currentView === 'explore'
                ? 'text-cyan-300 border-cyan-400 font-semibold drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Explore
          </button>

          <button
            onClick={() => onViewProfile(currentUser.id)}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              currentView === 'profile'
                ? 'text-cyan-300 border-cyan-400 font-semibold drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Profile
          </button>
        </nav>

        {/* Zone 3: 1 primary CTA + quick account switch */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Account Switcher for multi-user test */}
          <div className="relative hidden sm:block">
            <select
              value={currentUser.id}
              onChange={(e) => {
                const found = allUsers.find(u => u.id === e.target.value);
                if (found) onSwitchUser(found);
              }}
              className="bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs font-mono text-cyan-300 py-1.5 pl-2.5 pr-7 focus:outline-none focus:border-cyan-400 cursor-pointer"
              title="Switch active user to test following and liking"
            >
              {allUsers.map(u => (
                <option key={u.id} value={u.id} className="bg-slate-900 text-slate-200">
                  @{u.handle} ({u.displayName.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-black bg-cyan-400 rounded-lg hover:bg-cyan-300 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Pulse</span>
          </button>

          {/* User profile avatar click */}
          <button
            onClick={() => onViewProfile(currentUser.id)}
            className="focus:outline-none rounded-full ring-2 ring-cyan-500/30 hover:ring-cyan-400 transition-all shrink-0"
            title={`View profile for ${currentUser.displayName}`}
          >
            <Avatar src={currentUser.avatar} name={currentUser.displayName} size="sm" neonBorder="cyan" />
          </button>
        </div>

      </div>
    </header>
  );
};
