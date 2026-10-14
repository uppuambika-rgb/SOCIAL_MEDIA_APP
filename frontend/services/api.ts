import { IUser, IPost, IComment, IDBStatus, FeedType } from '../types';

const BASE_URL = '/api';

/**
 * Fetch all posts with filters
 */
export async function fetchPosts(params: {
  feedType?: FeedType;
  tag?: string;
  authorId?: string;
  currentUserId?: string;
}): Promise<IPost[]> {
  const query = new URLSearchParams();
  if (params.feedType) query.set('feedType', params.feedType);
  if (params.tag) query.set('tag', params.tag);
  if (params.authorId) query.set('authorId', params.authorId);
  if (params.currentUserId) query.set('currentUserId', params.currentUserId);

  const res = await fetch(`${BASE_URL}/posts?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  const json = await res.json();
  return json.data || [];
}

/**
 * Fetch single post
 */
export async function fetchPostById(id: string): Promise<IPost> {
  const res = await fetch(`${BASE_URL}/posts/${id}`);
  if (!res.ok) throw new Error('Post not found');
  const json = await res.json();
  return json.data;
}

/**
 * Create a new post
 */
export async function createPost(data: {
  authorId: string;
  content: string;
  mediaUrl?: string;
  tags?: string[];
}): Promise<IPost> {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create post');
  const json = await res.json();
  return json.data;
}

/**
 * Toggle like on a post
 */
export async function togglePostLike(postId: string, userId: string): Promise<{ liked: boolean; likesCount: number }> {
  const res = await fetch(`${BASE_URL}/posts/${postId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  if (!res.ok) throw new Error('Failed to toggle like');
  const json = await res.json();
  return json.data;
}

/**
 * Delete a post
 */
export async function deletePost(postId: string, authorId: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ authorId })
  });
  if (!res.ok) throw new Error('Failed to delete post');
  return true;
}

/**
 * Fetch comments for a post
 */
export async function fetchComments(postId: string): Promise<IComment[]> {
  const res = await fetch(`${BASE_URL}/comments?postId=${postId}`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  const json = await res.json();
  return json.data || [];
}

/**
 * Add a comment
 */
export async function addComment(postId: string, authorId: string, content: string): Promise<IComment> {
  const res = await fetch(`${BASE_URL}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postId, authorId, content })
  });
  if (!res.ok) throw new Error('Failed to post comment');
  const json = await res.json();
  return json.data;
}

/**
 * Toggle like on comment
 */
export async function toggleCommentLike(commentId: string, userId: string): Promise<{ liked: boolean; likesCount: number }> {
  const res = await fetch(`${BASE_URL}/comments/${commentId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  if (!res.ok) throw new Error('Failed to like comment');
  const json = await res.json();
  return json.data;
}

/**
 * Fetch all users
 */
export async function fetchUsers(): Promise<IUser[]> {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  const json = await res.json();
  return json.data || [];
}

/**
 * Fetch user by ID
 */
export async function fetchUserById(idOrUsername: string, currentUserId?: string): Promise<IUser> {
  const query = currentUserId ? `?currentUserId=${currentUserId}` : '';
  const res = await fetch(`${BASE_URL}/users/${idOrUsername}${query}`);
  if (!res.ok) throw new Error('User not found');
  const json = await res.json();
  return json.data;
}

/**
 * Update user profile
 */
export async function updateUserProfile(id: string, updates: Partial<IUser>): Promise<IUser> {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update profile');
  const json = await res.json();
  return json.data;
}

/**
 * Toggle follow user
 */
export async function toggleFollowUser(targetUserId: string, followerId: string): Promise<{ following: boolean; followersCount: number }> {
  const res = await fetch(`${BASE_URL}/users/${targetUserId}/follow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ followerId })
  });
  if (!res.ok) throw new Error('Failed to follow/unfollow');
  const json = await res.json();
  return json.data;
}

/**
 * Get followers
 */
export async function fetchFollowers(userId: string): Promise<IUser[]> {
  const res = await fetch(`${BASE_URL}/users/${userId}/followers`);
  if (!res.ok) throw new Error('Failed to fetch followers');
  const json = await res.json();
  return json.data || [];
}

/**
 * Get following
 */
export async function fetchFollowing(userId: string): Promise<IUser[]> {
  const res = await fetch(`${BASE_URL}/users/${userId}/following`);
  if (!res.ok) throw new Error('Failed to fetch following');
  const json = await res.json();
  return json.data || [];
}

/**
 * Get system & MongoDB status
 */
export async function fetchSystemStatus(): Promise<IDBStatus> {
  const res = await fetch(`${BASE_URL}/system/status`);
  if (!res.ok) throw new Error('Failed to get database status');
  const json = await res.json();
  return json.data;
}

/**
 * Configure MongoDB URI
 */
export async function configureMongoDB(mongoUri: string): Promise<{ success: boolean; message: string; data: IDBStatus }> {
  const res = await fetch(`${BASE_URL}/system/configure-db`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mongoUri })
  });
  const json = await res.json();
  return json;
}
