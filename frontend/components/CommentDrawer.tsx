import React, { useState, useEffect } from 'react';
import { IComment, IUser } from '../types';
import { fetchComments, addComment, toggleCommentLike } from '../services/api';
import { Avatar } from './Avatar';
import { Heart, Send, MessageSquare } from 'lucide-react';

interface CommentDrawerProps {
  postId: string;
  currentUser: IUser;
  isOpen: boolean;
  onViewProfile: (userId: string) => void;
  onCommentCountChange: (count: number) => void;
}

export const CommentDrawer: React.FC<CommentDrawerProps> = ({
  postId,
  currentUser,
  isOpen,
  onViewProfile,
  onCommentCountChange
}) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadComments();
    }
  }, [isOpen, postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await fetchComments(postId);
      setComments(data);
      onCommentCountChange(data.length);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      const created = await addComment(postId, currentUser.id, newComment.trim());
      const nextComments = [...comments, created];
      setComments(nextComments);
      onCommentCountChange(nextComments.length);
      setNewComment('');
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLike = async (commentId: string) => {
    try {
      const res = await toggleCommentLike(commentId, currentUser.id);
      setComments(prev =>
        prev.map(c => {
          if (c.id === commentId) {
            const liked = res.liked;
            const likedBy = liked
              ? [...c.likedBy, currentUser.id]
              : c.likedBy.filter(id => id !== currentUser.id);
            return { ...c, likesCount: res.likesCount, likedBy };
          }
          return c;
        })
      );
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4">
      {/* Existing comments */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-xs text-slate-500 font-mono py-2">Loading transmission responses...</div>
        ) : comments.length === 0 ? (
          <div className="text-xs text-slate-500 py-3 text-center">
            No transmissions recorded yet. Be the first to reply.
          </div>
        ) : (
          comments.map(c => {
            const isLiked = c.likedBy?.includes(currentUser.id);
            return (
              <div key={c.id} className="flex gap-3 text-xs group">
                <button
                  onClick={() => onViewProfile(c.authorId)}
                  className="shrink-0 focus:outline-none"
                >
                  <Avatar
                    src={c.author?.avatar}
                    name={c.author?.displayName || 'User'}
                    size="sm"
                  />
                </button>
                <div className="flex-1 bg-slate-900/50 rounded-xl p-3 border border-slate-800/60">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewProfile(c.authorId)}
                        className="font-semibold text-slate-200 hover:text-cyan-300 transition-colors"
                      >
                        {c.author?.displayName || 'Anonymous'}
                      </button>
                      <span className="text-slate-500 font-mono">@{c.author?.handle || 'user'}</span>
                      <span className="text-slate-600" aria-hidden="true">·</span>
                      <span className="text-slate-500">
                        {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleLike(c.id)}
                      className={`flex items-center gap-1 transition-colors ${
                        isLiked ? 'text-rose-400' : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title="Like response"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      <span className="font-mono tabular-nums text-[11px]">{c.likesCount || 0}</span>
                    </button>
                  </div>

                  <p className="text-slate-300 leading-relaxed break-words">{c.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New comment input */}
      <form onSubmit={handleAddComment} className="flex gap-2.5 items-center pt-2">
        <Avatar src={currentUser.avatar} name={currentUser.displayName} size="sm" />
        <div className="flex-1 relative">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a response..."
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />
        </div>
        <button
          type="submit"
          disabled={!newComment.trim() || submitting}
          className="p-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-xl hover:bg-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          title="Send comment"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
