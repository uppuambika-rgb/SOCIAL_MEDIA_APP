import React from 'react';
import { IUser } from '../types';
import { Avatar } from './Avatar';
import { Search, Hash, UserPlus, UserCheck, Flame } from 'lucide-react';

interface ExploreSidebarProps {
  allUsers: IUser[];
  currentUser: IUser;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectTag: (tag: string) => void;
  onViewProfile: (userId: string) => void;
  onToggleFollow: (targetUserId: string) => void;
  isFollowingMap: Record<string, boolean>;
}

export const ExploreSidebar: React.FC<ExploreSidebarProps> = ({
  allUsers,
  currentUser,
  searchQuery,
  onSearchChange,
  onSelectTag,
  onViewProfile,
  onToggleFollow,
  isFollowingMap
}) => {
  const trendingTags = [
    { tag: 'WebGLArt', count: '1.4k pulses', hot: true },
    { tag: 'NeonAesthetics', count: '980 pulses', hot: true },
    { tag: 'CyberUI', count: '740 pulses', hot: false },
    { tag: 'ModularSynth', count: '520 pulses', hot: false },
    { tag: 'FutureTech', count: '410 pulses', hot: false }
  ];

  // Suggested users (exclude current user)
  const suggestedUsers = allUsers.filter(u => u.id !== currentUser.id).slice(0, 4);

  return (
    <aside className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search pulses or pilots..."
          className="w-full bg-[#0b0e17]/90 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all backdrop-blur-md"
        />
      </div>

      {/* Trending Hashtags */}
      <div className="bg-[#0b0e17]/80 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h4 className="font-['Outfit'] font-bold text-xs text-slate-200">Trending Frequencies</h4>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Live</span>
        </div>

        <div className="space-y-2">
          {trendingTags.map(({ tag, count, hot }) => (
            <button
              key={tag}
              onClick={() => onSelectTag(tag)}
              className="w-full text-left p-2 rounded-xl hover:bg-slate-900/80 transition-colors flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-mono font-semibold text-slate-300 group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <Hash className="w-3 h-3 text-cyan-400" />
                  <span>{tag}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono tabular-nums">{count}</div>
              </div>
              {hot && (
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-500/30 px-1.5 py-0.5 rounded">
                  Hot
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Pilots to Follow */}
      <div className="bg-[#0b0e17]/80 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-xl">
        <h4 className="font-['Outfit'] font-bold text-xs text-slate-200 mb-3">
          Suggested Pilots
        </h4>

        <div className="space-y-3">
          {suggestedUsers.map(u => {
            const isFollowing = isFollowingMap[u.id] ?? false;
            return (
              <div key={u.id} className="flex items-center justify-between gap-3">
                <button
                  onClick={() => onViewProfile(u.id)}
                  className="flex items-center gap-2.5 min-w-0 text-left focus:outline-none flex-1"
                >
                  <Avatar src={u.avatar} name={u.displayName} size="sm" />
                  <div className="min-w-0">
                    <div className="font-semibold text-xs text-slate-200 hover:text-cyan-300 transition-colors truncate">
                      {u.displayName}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 truncate">@{u.handle}</div>
                  </div>
                </button>

                <button
                  onClick={() => onToggleFollow(u.id)}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                    isFollowing
                      ? 'bg-slate-800 text-slate-300 hover:bg-rose-950/40 hover:text-rose-400 border border-slate-700'
                      : 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40'
                  }`}
                  title={isFollowing ? 'Unfollow' : 'Follow'}
                >
                  {isFollowing ? (
                    <UserCheck className="w-3.5 h-3.5" />
                  ) : (
                    <UserPlus className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
