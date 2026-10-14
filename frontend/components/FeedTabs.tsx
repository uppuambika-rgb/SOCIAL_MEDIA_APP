import React from 'react';
import { FeedType } from '../types';
import { Sparkles, Users, Flame, Hash, X } from 'lucide-react';

interface FeedTabsProps {
  activeFeed: FeedType;
  onSelectFeed: (feed: FeedType) => void;
  selectedTag?: string;
  onClearTag?: () => void;
}

export const FeedTabs: React.FC<FeedTabsProps> = ({
  activeFeed,
  onSelectFeed,
  selectedTag,
  onClearTag
}) => {
  return (
    <div className="flex items-center justify-between gap-3 p-1.5 bg-slate-900/70 border border-slate-800/80 rounded-xl backdrop-blur-md mb-6">
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            if (onClearTag) onClearTag();
            onSelectFeed('all');
          }}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeFeed === 'all' && !selectedTag
              ? 'bg-slate-800 text-cyan-300 shadow-sm border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>For You</span>
        </button>

        <button
          onClick={() => {
            if (onClearTag) onClearTag();
            onSelectFeed('following');
          }}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeFeed === 'following' && !selectedTag
              ? 'bg-slate-800 text-cyan-300 shadow-sm border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-fuchsia-400" />
          <span>Following</span>
        </button>

        <button
          onClick={() => {
            if (onClearTag) onClearTag();
            onSelectFeed('trending');
          }}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeFeed === 'trending' && !selectedTag
              ? 'bg-slate-800 text-cyan-300 shadow-sm border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Trending</span>
        </button>
      </div>

      {selectedTag && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-950/40 border border-cyan-500/40 rounded-lg text-xs font-mono text-cyan-300 shrink-0">
          <Hash className="w-3.5 h-3.5" />
          <span>{selectedTag}</span>
          {onClearTag && (
            <button
              onClick={onClearTag}
              className="ml-1 p-0.5 hover:bg-cyan-900/60 rounded text-cyan-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
