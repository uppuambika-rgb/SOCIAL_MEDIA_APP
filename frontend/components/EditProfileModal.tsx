import React, { useState } from 'react';
import { IUser } from '../types';
import { Avatar } from './Avatar';
import { X, Save, Image, Link as LinkIcon, MapPin } from 'lucide-react';

interface EditProfileModalProps {
  user: IUser;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: Partial<IUser>) => Promise<void>;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave
}) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio);
  const [location, setLocation] = useState(user.location || '');
  const [website, setWebsite] = useState(user.website || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [banner, setBanner] = useState(user.banner || '');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onSave({
        displayName: displayName.trim(),
        bio: bio.trim(),
        location: location.trim(),
        website: website.trim(),
        avatar: avatar.trim(),
        banner: banner.trim()
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e121d] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h3 className="font-['Outfit'] text-lg font-bold text-white">Edit Pilot Profile</h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Banner Preview */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">Banner Image URL</label>
            <div className="relative h-24 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 mb-2">
              {banner ? (
                <img
                  src={banner}
                  alt="Banner preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={() => setBanner('')}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 flex items-center justify-center text-xs text-slate-500 font-mono">
                  Default Cyber Grid Banner
                </div>
              )}
            </div>
            <input
              type="url"
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          {/* Avatar Preview & URL */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">Avatar Image URL</label>
            <div className="flex items-center gap-3 mb-2">
              <Avatar src={avatar} name={displayName || 'User'} size="lg" neonBorder="cyan" />
              <div className="flex-1">
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Display Name</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Bio Transmission</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={200}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 resize-none"
            />
            <div className="text-right text-[11px] font-mono text-slate-500">{200 - bio.length} chars remaining</div>
          </div>

          {/* Location & Website Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Sector / Location</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Neo-Tokyo, Sector 7"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 flex items-center gap-1">
                <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Neural Web / Link</span>
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://novaprime.design"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-black bg-cyan-400 rounded-lg hover:bg-cyan-300 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Syncing...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
