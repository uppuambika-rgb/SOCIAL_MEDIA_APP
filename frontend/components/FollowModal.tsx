import React from 'react';
import { IUser } from '../types';
import { Avatar } from './Avatar';
import { X, UserPlus, UserCheck } from 'lucide-react';

interface FollowModalProps {
  isOpen: boolean;
  title: string;
  users: IUser[];
  currentUserId: string;
  onClose: () => void;
  onViewProfile: (userId: string) => void;
  onToggleFollow: (targetUserId: string) => void;
  isFollowingMap: Record<string, boolean>;
}

export const FollowModal: React.FC<FollowModalProps> = ({
  isOpen,
  title,
  users,
  currentUserId,
  onClose,
  onViewProfile,
  onToggleFollow,
  isFollowingMap
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0e121d] border border-slate-700/80 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="font-['Outfit'] text-lg font-bold text-white flex items-center gap-2">
            <span>{title}</span>
            <span className="text-xs font-mono text-cyan-400">({users.length})</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 max-h-96 overflow-y-auto space-y-3 pr-1">
          {users.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500 font-mono">
              No entities detected in this sector.
            </div>
          ) : (
            users.map((u) => {
              const isSelf = u.id === currentUserId;
              const isFollowing = isFollowingMap[u.id] ?? false;

              return (
                <div
                  key={u.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all"
                >
                  <button
                    onClick={() => {
                      onViewProfile(u.id);
                      onClose();
                    }}
                    className="flex items-center gap-3 text-left min-w-0 flex-1 focus:outline-none"
                  >
                    <Avatar src={u.avatar} name={u.displayName} size="md" />
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-slate-100 hover:text-cyan-300 transition-colors truncate">
                        {u.displayName}
                      </div>
                      <div className="text-xs font-mono text-slate-400 truncate">@{u.handle}</div>
                    </div>
                  </button>

                  {!isSelf && (
                    <button
                      onClick={() => onToggleFollow(u.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isFollowing
                          ? 'bg-slate-800 text-slate-300 hover:bg-rose-950/40 hover:text-rose-400 border border-slate-700'
                          : 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
