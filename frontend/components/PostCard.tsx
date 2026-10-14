import React, { useState } from 'react';
import { IPost, IUser } from '../types';
import { Avatar } from './Avatar';
import { CommentDrawer } from './CommentDrawer';
import { togglePostLike, deletePost, toggleFollowUser } from '../services/api';
import { Heart, MessageSquare, Share2, Trash2, UserPlus, UserCheck, MoreHorizontal } from 'lucide-react';

interface PostCardProps {
  post: IPost;
  currentUser: IUser;
  onViewProfile: (userId: string) => void;
  onFilterTag: (tag: string) => void;
  onPostDeleted: (postId: string) => void;
  onFollowToggled?: (targetUserId: string, isNowFollowing: boolean) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onViewProfile,
  onFilterTag,
  onPostDeleted,
  onFollowToggled
}) => {
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isLiked, setIsLiked] = useState(post.likedBy?.includes(currentUser.id) || false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isHeartPopping, setIsHeartPopping] = useState(false);

  const author = post.author;
  const isAuthor = post.authorId === currentUser.id;

  const handleLike = async () => {
    // Optimistic toggle
    const nextLiked = !isLiked;
    const nextCount = nextLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
    setIsLiked(nextLiked);
    setLikesCount(nextCount);
    if (nextLiked) {
      setIsHeartPopping(true);
      setTimeout(() => setIsHeartPopping(false), 500);
    }

    try {
      const res = await togglePostLike(post.id, currentUser.id);
      setIsLiked(res.liked);
      setLikesCount(res.likesCount);
    } catch (e) {
      // Revert on error
      setIsLiked(!nextLiked);
      setLikesCount(likesCount);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this pulse transmission?')) return;
    try {
      setIsDeleting(true);
      await deletePost(post.id, currentUser.id);
      onPostDeleted(post.id);
    } catch (e) {
      alert('Failed to delete post');
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return 'just now';
      if (diffMin < 60) return `${diffMin}m`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours}h`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d`;
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return 'recently';
    }
  };

  // Highlight hashtags and mentions in text
  const renderFormattedContent = (text: string) => {
    const parts = text.split(/(#[a-zA-Z0-9_]+|@[a-zA-Z0-9_]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        const tag = part.substring(1);
        return (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              onFilterTag(tag);
            }}
            className="text-cyan-400 hover:text-cyan-300 font-mono hover:underline inline-block transition-colors"
          >
            {part}
          </button>
        );
      }
      if (part.startsWith('@')) {
        const username = part.substring(1);
        return (
          <span key={index} className="text-fuchsia-400 font-mono">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <article className="bg-[#0b0e17]/85 border border-slate-800/80 hover:border-slate-700/90 rounded-2xl p-4 sm:p-5 mb-4 backdrop-blur-xl transition-all shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]">
      {/* Header with author info & clean unboxed metadata */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onViewProfile(post.authorId)}
            className="focus:outline-none shrink-0"
          >
            <Avatar
              src={author?.avatar}
              name={author?.displayName || 'User'}
              size="md"
              neonBorder={post.authorId === currentUser.id ? 'cyan' : 'none'}
            />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <button
                onClick={() => onViewProfile(post.authorId)}
                className="font-bold text-slate-100 hover:text-cyan-300 transition-colors truncate"
              >
                {author?.displayName || 'Unknown Pilot'}
              </button>

              <span className="text-slate-500 font-mono truncate">@{author?.handle || 'user'}</span>

              <span className="text-slate-600" aria-hidden="true">·</span>

              <time dateTime={post.createdAt} className="text-slate-500 font-mono tabular-nums">
                {formatRelativeTime(post.createdAt)}
              </time>
            </div>

            {author?.bio && (
              <p className="text-[11px] text-slate-400 truncate max-w-sm hidden sm:block">
                {author.bio}
              </p>
            )}
          </div>
        </div>

        {/* Delete or Context Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {isAuthor ? (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
              title="Delete transmission"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onViewProfile(post.authorId)}
              className="px-2.5 py-1 text-[11px] font-medium text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 rounded-lg transition-all"
            >
              View Pilot
            </button>
          )}
        </div>
      </div>

      {/* Post Text */}
      <div className="text-slate-200 text-sm leading-relaxed mb-3 break-words">
        {renderFormattedContent(post.content)}
      </div>

      {/* Post Media Attachment if exists */}
      {post.mediaUrl && (
        <div className="mb-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-950/70 max-h-96">
          <img
            src={post.mediaUrl}
            alt="Pulse media attachment"
            referrerPolicy="no-referrer"
            className="w-full h-auto max-h-96 object-cover hover:scale-[1.01] transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Post Action Bar (Like, Comment, Share) */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-6">
          {/* Like button with glowing heart */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 py-1 px-2 rounded-lg transition-all ${
              isLiked
                ? 'text-rose-400 bg-rose-950/30 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'hover:text-rose-400 hover:bg-slate-800/60'
            }`}
            title={isLiked ? 'Unlike transmission' : 'Like transmission'}
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 ${
                isLiked ? 'fill-current text-rose-500' : ''
              } ${isHeartPopping ? 'scale-125' : 'scale-100'}`}
            />
            <span className="font-mono tabular-nums font-semibold">{likesCount}</span>
          </button>

          {/* Comment toggle button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 py-1 px-2 rounded-lg transition-colors ${
              showComments
                ? 'text-cyan-400 bg-cyan-950/30 border border-cyan-500/20'
                : 'hover:text-cyan-400 hover:bg-slate-800/60'
            }`}
            title="View discussion"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="font-mono tabular-nums">{commentsCount}</span>
          </button>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 py-1 px-2 rounded-lg hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            title="Copy pulse link"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Embedded Comment Drawer */}
      <CommentDrawer
        postId={post.id}
        currentUser={currentUser}
        isOpen={showComments}
        onViewProfile={onViewProfile}
        onCommentCountChange={(count) => setCommentsCount(count)}
      />
    </article>
  );
};
