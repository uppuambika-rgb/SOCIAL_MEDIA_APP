import React, { useState, useEffect } from 'react';
import { IUser, IPost, ProfileTab } from '../types';
import { Avatar } from './Avatar';
import { PostCard } from './PostCard';
import { FollowModal } from './FollowModal';
import { EditProfileModal } from './EditProfileModal';
import {
  fetchUserById,
  fetchPosts,
  fetchFollowers,
  fetchFollowing,
  toggleFollowUser,
  updateUserProfile
} from '../services/api';
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  Edit3,
  UserPlus,
  UserCheck,
  Grid,
  Heart,
  Image as ImageIcon,
  ArrowLeft
} from 'lucide-react';

interface UserProfileViewProps {
  userId: string;
  currentUser: IUser;
  onBack: () => void;
  onViewProfile: (userId: string) => void;
  onFilterTag: (tag: string) => void;
  onUpdateCurrentUser: (updated: IUser) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  userId,
  currentUser,
  onBack,
  onViewProfile,
  onFilterTag,
  onUpdateCurrentUser
}) => {
  const [profileUser, setProfileUser] = useState<IUser | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Modals
  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followModalTitle, setFollowModalTitle] = useState<'Followers' | 'Following'>('Followers');
  const [followModalUsers, setFollowModalUsers] = useState<IUser[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isFollowingMap, setIsFollowingMap] = useState<Record<string, boolean>>({});

  const isSelf = profileUser?.id === currentUser.id;

  useEffect(() => {
    loadProfileData();
  }, [userId, currentUser.id]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const user = await fetchUserById(userId, currentUser.id);
      setProfileUser(user);
      setIsFollowing(user.isFollowing ?? false);
      setFollowersCount(user.followersCount);
      setFollowingCount(user.followingCount);

      // Load all posts
      const allPosts = await fetchPosts({});
      setPosts(allPosts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFollow = async () => {
    if (!profileUser || isSelf) return;

    const nextState = !isFollowing;
    const nextCount = nextState ? followersCount + 1 : Math.max(0, followersCount - 1);
    setIsFollowing(nextState);
    setFollowersCount(nextCount);

    try {
      const res = await toggleFollowUser(profileUser.id, currentUser.id);
      setIsFollowing(res.following);
      setFollowersCount(res.followersCount);
    } catch (e) {
      // Revert on error
      setIsFollowing(!nextState);
      setFollowersCount(followersCount);
    }
  };

  const handleOpenFollowers = async () => {
    if (!profileUser) return;
    try {
      const data = await fetchFollowers(profileUser.id);
      setFollowModalUsers(data);
      setFollowModalTitle('Followers');
      // Build following map for current user
      const followingList = await fetchFollowing(currentUser.id);
      const map: Record<string, boolean> = {};
      followingList.forEach(u => (map[u.id] = true));
      setIsFollowingMap(map);
      setFollowModalOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenFollowing = async () => {
    if (!profileUser) return;
    try {
      const data = await fetchFollowing(profileUser.id);
      setFollowModalUsers(data);
      setFollowModalTitle('Following');
      const followingList = await fetchFollowing(currentUser.id);
      const map: Record<string, boolean> = {};
      followingList.forEach(u => (map[u.id] = true));
      setIsFollowingMap(map);
      setFollowModalOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFollowInModal = async (targetId: string) => {
    try {
      const current = isFollowingMap[targetId] || false;
      const res = await toggleFollowUser(targetId, currentUser.id);
      setIsFollowingMap(prev => ({ ...prev, [targetId]: res.following }));
      if (targetId === profileUser?.id) {
        setIsFollowing(res.following);
        setFollowersCount(res.followersCount);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProfile = async (updates: Partial<IUser>) => {
    if (!profileUser) return;
    const updated = await updateUserProfile(profileUser.id, updates);
    setProfileUser(updated);
    if (isSelf) {
      onUpdateCurrentUser(updated);
    }
  };

  const handlePostDeleted = (deletedPostId: string) => {
    setPosts(prev => prev.filter(p => p.id !== deletedPostId));
    if (profileUser) {
      setProfileUser(prev => prev ? { ...prev, postsCount: Math.max(0, prev.postsCount - 1) } : null);
    }
  };

  if (loading || !profileUser) {
    return (
      <div className="py-20 text-center font-mono text-cyan-400 text-sm">
        <div className="inline-block w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3" />
        <div>Connecting to neural profile node...</div>
      </div>
    );
  }

  // Filter posts based on active profile tab
  const tabPosts = posts.filter(post => {
    if (activeTab === 'posts') {
      return post.authorId === profileUser.id;
    }
    if (activeTab === 'likes') {
      return post.likedBy?.includes(profileUser.id);
    }
    if (activeTab === 'media') {
      return post.authorId === profileUser.id && Boolean(post.mediaUrl);
    }
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-4 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Feed</span>
      </button>

      {/* Profile Header Box */}
      <div className="bg-[#0b0e17]/90 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-xl mb-6 shadow-2xl">
        {/* Banner with cyber overlay */}
        <div className="relative h-44 sm:h-52 bg-slate-900 overflow-hidden">
          {profileUser.banner ? (
            <img
              src={profileUser.banner}
              alt={`${profileUser.displayName}'s banner`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-slate-950 via-cyan-950/40 to-fuchsia-950/40 flex items-center justify-center">
              <span className="font-['Outfit'] text-2xl font-black text-slate-800 tracking-widest uppercase">
                NEONVOX NODE
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e17] via-transparent to-transparent opacity-90" />
        </div>

        {/* Profile Info Row */}
        <div className="px-5 sm:px-6 pb-6 relative -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
            {/* Avatar */}
            <div className="relative">
              <Avatar
                src={profileUser.avatar}
                name={profileUser.displayName}
                size="xl"
                neonBorder="cyan"
                className="ring-4 ring-[#0b0e17]"
              />
            </div>

            {/* Actions: Follow/Unfollow OR Edit Profile */}
            <div className="flex items-center gap-2">
              {isSelf ? (
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  onClick={handleToggleFollow}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] ${
                    isFollowing
                      ? 'bg-slate-800 text-slate-300 hover:bg-rose-950/40 hover:text-rose-400 border border-slate-700'
                      : 'bg-cyan-400 hover:bg-cyan-300 text-black'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Follow Pilot</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* User Name, Handle, Badge */}
          <div className="space-y-1 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-['Outfit'] text-xl sm:text-2xl font-bold text-white tracking-tight">
                {profileUser.displayName}
              </h1>
              {profileUser.badge && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">
                  {profileUser.badge}
                </span>
              )}
            </div>
            <div className="text-xs font-mono text-cyan-400">@{profileUser.handle}</div>
          </div>

          {/* Bio */}
          {profileUser.bio && (
            <p className="text-sm text-slate-300 leading-relaxed mb-4 max-w-2xl">
              {profileUser.bio}
            </p>
          )}

          {/* Metadata Row (clean unboxed text with dots) */}
          <div className="flex items-center gap-4 flex-wrap text-xs text-slate-400 font-mono mb-5">
            {profileUser.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{profileUser.location}</span>
              </div>
            )}

            {profileUser.website && (
              <div className="flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                <a
                  href={profileUser.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline truncate max-w-xs"
                >
                  {profileUser.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Joined {new Date(profileUser.createdAt).toLocaleDateString([], { month: 'short', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Stats Bar (Clickable Followers & Following with tabular nums) */}
          <div className="flex items-center gap-6 pt-4 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white font-mono tabular-nums text-sm">
                {tabPosts.filter(p => p.authorId === profileUser.id).length || profileUser.postsCount}
              </span>
              <span className="text-slate-400">Pulses</span>
            </div>

            <button
              onClick={handleOpenFollowers}
              className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors group"
            >
              <span className="font-bold text-white group-hover:text-cyan-300 font-mono tabular-nums text-sm">
                {followersCount}
              </span>
              <span className="text-slate-400 group-hover:text-cyan-300">Followers</span>
            </button>

            <button
              onClick={handleOpenFollowing}
              className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors group"
            >
              <span className="font-bold text-white group-hover:text-cyan-300 font-mono tabular-nums text-sm">
                {followingCount}
              </span>
              <span className="text-slate-400 group-hover:text-cyan-300">Following</span>
            </button>
          </div>
        </div>

        {/* Profile Tabs (Posts, Liked, Media) */}
        <div className="flex border-t border-slate-800/80 bg-slate-900/40">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-all border-b-2 ${
              activeTab === 'posts'
                ? 'text-cyan-400 border-cyan-400 bg-cyan-950/20'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Pulses</span>
          </button>

          <button
            onClick={() => setActiveTab('likes')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-all border-b-2 ${
              activeTab === 'likes'
                ? 'text-cyan-400 border-cyan-400 bg-cyan-950/20'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Liked</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-all border-b-2 ${
              activeTab === 'media'
                ? 'text-cyan-400 border-cyan-400 bg-cyan-950/20'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Media</span>
          </button>
        </div>
      </div>

      {/* Tab Posts List */}
      <div className="space-y-4">
        {tabPosts.length === 0 ? (
          <div className="py-16 text-center bg-[#0b0e17]/60 rounded-2xl border border-slate-800/60 p-6">
            <div className="text-slate-400 text-sm font-semibold mb-1">
              No pulses in this sector yet
            </div>
            <div className="text-xs text-slate-500 font-mono">
              {activeTab === 'posts' && 'This pilot has not transmitted any pulses yet.'}
              {activeTab === 'likes' && 'No liked transmissions found.'}
              {activeTab === 'media' && 'No media attachments found.'}
            </div>
          </div>
        ) : (
          tabPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onViewProfile={onViewProfile}
              onFilterTag={onFilterTag}
              onPostDeleted={handlePostDeleted}
            />
          ))
        )}
      </div>

      {/* Follow / Following Modal */}
      <FollowModal
        isOpen={followModalOpen}
        title={followModalTitle}
        users={followModalUsers}
        currentUserId={currentUser.id}
        onClose={() => setFollowModalOpen(false)}
        onViewProfile={onViewProfile}
        onToggleFollow={handleToggleFollowInModal}
        isFollowingMap={isFollowingMap}
      />

      {/* Edit Profile Modal */}
      {isSelf && (
        <EditProfileModal
          user={profileUser}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
};
