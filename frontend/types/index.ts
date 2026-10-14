export interface IUser {
  id: string;
  username: string;
  handle: string;
  displayName: string;
  avatar: string;
  banner: string;
  bio: string;
  location?: string;
  website?: string;
  badge?: 'CREATOR' | 'CYBER_DEV' | 'NEON_CORE' | 'SYNTH_PRO';
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: string;
  isFollowing?: boolean;
}

export interface IPost {
  id: string;
  authorId: string;
  author?: IUser;
  content: string;
  mediaUrl?: string;
  tags: string[];
  likesCount: number;
  likedBy: string[];
  commentsCount: number;
  createdAt: string;
}

export interface IComment {
  id: string;
  postId: string;
  authorId: string;
  author?: IUser;
  content: string;
  likesCount: number;
  likedBy: string[];
  createdAt: string;
}

export interface IDBStatus {
  connected: boolean;
  mode: 'mongodb' | 'memory';
  statusText: string;
  mongoUriMasked?: string;
  stats: {
    users: number;
    posts: number;
    comments: number;
    follows: number;
  };
}

export type FeedType = 'all' | 'following' | 'trending';
export type ViewMode = 'feed' | 'profile' | 'explore' | 'database';
export type ProfileTab = 'posts' | 'likes' | 'media';
