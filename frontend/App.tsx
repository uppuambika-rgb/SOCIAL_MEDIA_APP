import React, { useState, useEffect } from 'react';
import { IUser, IPost, FeedType, ViewMode } from './types';
import {
  fetchPosts,
  fetchUsers,
  createPost,
  toggleFollowUser,
  fetchFollowing
} from './services/api';
import { Navbar } from './components/Navbar';
import { FeedTabs } from './components/FeedTabs';
import { CreatePostCard } from './components/CreatePostCard';
import { PostCard } from './components/PostCard';
import { UserProfileView } from './components/UserProfileView';
import { ExploreSidebar } from './components/ExploreSidebar';
import { Sparkles, Compass, X } from 'lucide-react';

export default function App() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Navigation & Views
  const [currentView, setCurrentView] = useState<ViewMode>('feed');
  const [activeProfileUserId, setActiveProfileUserId] = useState<string | null>(null);
  const [activeFeed, setActiveFeed] = useState<FeedType>('all');
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFollowingMap, setIsFollowingMap] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial load
  useEffect(() => {
    bootstrap();
  }, []);

  const bootstrap = async () => {
    try {
      const usersData = await fetchUsers();
      setUsers(usersData);

      // Default active user is Nova Rivera
      const defaultUser = usersData.find(u => u.username === 'novaprime') || usersData[0];
      if (defaultUser) {
        setCurrentUser(defaultUser);
        loadFollowingMap(defaultUser.id);
      }
    } catch (e) {
      console.error('Bootstrap error', e);
    }
  };

  const loadFollowingMap = async (userId: string) => {
    try {
      const followingList = await fetchFollowing(userId);
      const map: Record<string, boolean> = {};
      followingList.forEach(u => (map[u.id] = true));
      setIsFollowingMap(map);
    } catch (e) {
      console.error(e);
    }
  };

  // Load posts whenever feed type or selected tag or current user changes
  useEffect(() => {
    if (currentUser) {
      loadFeedPosts();
    }
  }, [activeFeed, selectedTag, currentUser?.id]);

  const loadFeedPosts = async () => {
    try {
      setLoadingPosts(true);
      const data = await fetchPosts({
        feedType: activeFeed,
        tag: selectedTag,
        currentUserId: currentUser?.id
      });
      setPosts(data);
    } catch (e) {
      console.error('Failed to load posts', e);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleCreatePost = async (data: { content: string; mediaUrl?: string; tags?: string[] }) => {
    if (!currentUser) return;
    try {
      const newPost = await createPost({
        authorId: currentUser.id,
        content: data.content,
        mediaUrl: data.mediaUrl,
        tags: data.tags
      });
      setPosts(prev => [newPost, ...prev]);
      setIsCreateModalOpen(false);
      showToast('Pulse broadcasted to the network.');
    } catch (e: any) {
      alert(e.message || 'Failed to post');
    }
  };

  const handlePostDeleted = (deletedPostId: string) => {
    setPosts(prev => prev.filter(p => p.id !== deletedPostId));
    showToast('Transmission deleted.');
  };

  const handleToggleFollow = async (targetUserId: string) => {
    if (!currentUser) return;
    try {
      const res = await toggleFollowUser(targetUserId, currentUser.id);
      setIsFollowingMap(prev => ({ ...prev, [targetUserId]: res.following }));
      showToast(res.following ? 'Pilot followed.' : 'Pilot unfollowed.');
      // Refresh users list
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
      // Refresh feed if in following tab
      if (activeFeed === 'following') {
        loadFeedPosts();
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleSwitchUser = (newActiveUser: IUser) => {
    setCurrentUser(newActiveUser);
    loadFollowingMap(newActiveUser.id);
    showToast(`Switched active terminal to @${newActiveUser.handle}`);
  };

  const handleViewProfile = (userId: string) => {
    setActiveProfileUserId(userId);
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTag = (tag: string) => {
    setSelectedTag(tag);
    setCurrentView('feed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearTag = () => {
    setSelectedTag(undefined);
  };

  // Client-side search filtering
  const filteredPosts = posts.filter(post => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesContent = post.content.toLowerCase().includes(q);
    const matchesAuthor = post.author?.displayName.toLowerCase().includes(q) || post.author?.handle.toLowerCase().includes(q);
    const matchesTags = post.tags?.some(t => t.toLowerCase().includes(q));
    return matchesContent || matchesAuthor || matchesTags;
  });

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center font-mono text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(0,240,255,0.4)]" />
          <div className="text-sm tracking-wide">Initializing NEONVOX Neural Grid...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] cyber-grid-bg text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Bar Navigation */}
      <Navbar
        currentView={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          if (view === 'feed') {
            setSelectedTag(undefined);
          }
        }}
        currentUser={currentUser}
        allUsers={users}
        onSwitchUser={handleSwitchUser}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onViewProfile={handleViewProfile}
      />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Conditional View: Profile vs Feed */}
        {currentView === 'profile' && activeProfileUserId ? (
          <UserProfileView
            userId={activeProfileUserId}
            currentUser={currentUser}
            onBack={() => setCurrentView('feed')}
            onViewProfile={handleViewProfile}
            onFilterTag={handleSelectTag}
            onUpdateCurrentUser={(updated) => {
              setCurrentUser(updated);
              setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
            }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Feed Main Column */}
            <div className="lg:col-span-8 min-w-0">
              {/* Feed Segmented Controls */}
              <FeedTabs
                activeFeed={activeFeed}
                onSelectFeed={(feed) => {
                  setActiveFeed(feed);
                  setSelectedTag(undefined);
                }}
                selectedTag={selectedTag}
                onClearTag={handleClearTag}
              />

              {/* In-Feed Quick Composer */}
              <CreatePostCard
                currentUser={currentUser}
                onSubmit={handleCreatePost}
              />

              {/* Feed Posts */}
              {loadingPosts ? (
                <div className="py-16 text-center font-mono text-cyan-400 text-sm space-y-3">
                  <div className="inline-block w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <div>Receiving encrypted frequencies...</div>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="py-16 text-center bg-[#0b0e17]/60 rounded-2xl border border-slate-800/60 p-8 backdrop-blur-md">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-3 text-cyan-400">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="font-['Outfit'] font-bold text-base text-white mb-1">
                    No Pulses Located
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mb-4 font-mono">
                    {searchQuery
                      ? `No transmission matches the query "${searchQuery}".`
                      : activeFeed === 'following'
                      ? 'You are not following any pilots with active pulses yet. Follow creators to see their feed!'
                      : selectedTag
                      ? `No posts found under #${selectedTag}.`
                      : 'The frequency is quiet. Transmit the first pulse!'}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedTag(undefined);
                      setActiveFeed('all');
                    }}
                    className="px-4 py-1.5 text-xs font-mono font-medium text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 rounded-lg transition-all"
                  >
                    Reset Feed Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUser={currentUser}
                      onViewProfile={handleViewProfile}
                      onFilterTag={handleSelectTag}
                      onPostDeleted={handlePostDeleted}
                      onFollowToggled={handleToggleFollow}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:block lg:col-span-4 sticky top-24">
              <ExploreSidebar
                allUsers={users}
                currentUser={currentUser}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSelectTag={handleSelectTag}
                onViewProfile={handleViewProfile}
                onToggleFollow={handleToggleFollow}
                isFollowingMap={isFollowingMap}
              />
            </div>

          </div>
        )}
      </main>

      {/* Floating Create Post Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0e121d] border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,240,255,0.15)]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="font-['Outfit'] text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Transmit New Pulse</span>
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <CreatePostCard
              currentUser={currentUser}
              onSubmit={handleCreatePost}
            />
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-slate-900/95 border border-cyan-500/40 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.25)] text-xs font-mono text-cyan-300 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quiet Minimal Footer */}
      <footer className="border-t border-slate-900 bg-[#06080d] py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>NEONVOX Social Platform</div>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => handleViewProfile(currentUser.id)} className="hover:text-cyan-300 transition-colors">
              Pilot Profile
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
