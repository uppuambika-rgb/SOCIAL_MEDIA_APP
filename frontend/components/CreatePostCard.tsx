import React, { useState } from 'react';
import { IUser } from '../types';
import { Avatar } from './Avatar';
import { Image, Hash, Send, X } from 'lucide-react';

interface CreatePostCardProps {
  currentUser: IUser;
  onSubmit: (data: { content: string; mediaUrl?: string; tags?: string[] }) => Promise<void>;
}

export const CreatePostCard: React.FC<CreatePostCardProps> = ({ currentUser, onSubmit }) => {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const curatedPresets = [
    { label: 'Cyber Grid', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Night Neon City', url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Audio Modulars', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Laser Prism', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' }
  ];

  const popularTags = ['WebGLArt', 'NeonAesthetics', 'CyberUI', 'FutureTech', 'NightVibes'];

  const handleInsertTag = (tag: string) => {
    const formatted = `#${tag} `;
    if (!content.includes(`#${tag}`)) {
      setContent(prev => `${prev.trim()} ${formatted}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        content: content.trim(),
        mediaUrl: mediaUrl.trim() || undefined
      });
      setContent('');
      setMediaUrl('');
      setShowImageInput(false);
      setShowTagPicker(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0b0e17]/90 border border-slate-800/80 rounded-2xl p-4 sm:p-5 mb-6 backdrop-blur-xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)] focus-within:border-cyan-500/40 focus-within:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-all">
      <div className="flex gap-3 sm:gap-4 items-start">
        <Avatar src={currentUser.avatar} name={currentUser.displayName} size="md" neonBorder="cyan" />
        
        <div className="flex-1 min-w-0">
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Share a pulse with the neon network, ${currentUser.displayName.split(' ')[0]}...`}
              rows={3}
              maxLength={350}
              className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-500 resize-none focus:outline-none"
            />

            {/* Media Preview if attached */}
            {mediaUrl && (
              <div className="relative mb-3 rounded-xl overflow-hidden border border-slate-700/80 max-h-56 bg-slate-950">
                <img
                  src={mediaUrl}
                  alt="Attachment preview"
                  className="w-full h-48 object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => setMediaUrl('')}
                />
                <button
                  type="button"
                  onClick={() => setMediaUrl('')}
                  className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-black text-slate-300 hover:text-white rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Expandable Image URL Bar */}
            {showImageInput && !mediaUrl && (
              <div className="mb-3 p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="Paste image URL (https://...)"
                    className="flex-1 bg-black/50 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowImageInput(false)}
                    className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
                  >
                    Cancel
                  </button>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-500">Curated Neon Presets:</span>
                  {curatedPresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setMediaUrl(preset.url)}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/20 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Expandable Tag Picker */}
            {showTagPicker && (
              <div className="flex items-center gap-1.5 flex-wrap mb-3 p-2 bg-slate-900/60 rounded-xl border border-slate-800/60">
                <span className="text-[11px] text-slate-500">Trending tags:</span>
                {popularTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleInsertTag(tag)}
                    className="text-[11px] font-mono text-fuchsia-300 hover:text-white px-2 py-0.5 rounded bg-fuchsia-950/30 hover:bg-fuchsia-900/50 border border-fuchsia-500/30 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowImageInput(!showImageInput)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    showImageInput || mediaUrl
                      ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60'
                  }`}
                  title="Attach image or cyberpunk graphic"
                >
                  <Image className="w-4 h-4" />
                  <span className="hidden sm:inline">Media</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowTagPicker(!showTagPicker)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    showTagPicker
                      ? 'text-fuchsia-400 bg-fuchsia-950/40 border border-fuchsia-500/30'
                      : 'text-slate-400 hover:text-fuchsia-300 hover:bg-slate-800/60'
                  }`}
                  title="Add hashtags"
                >
                  <Hash className="w-4 h-4" />
                  <span className="hidden sm:inline">Tags</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono tabular-nums text-slate-500">
                  {350 - content.length}
                </span>

                <button
                  type="submit"
                  disabled={!content.trim() || isSubmitting}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-semibold text-xs rounded-lg hover:from-cyan-300 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Transmit'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
