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
}

export interface IPost {
  id: string;
  authorId: string;
  author?: IUser;
  content: string;
  mediaUrl?: string;
  tags: string[];
  likesCount: number;
  likedBy: string[]; // array of userIds
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

export interface IFollow {
  id: string;
  followerId: string; // user who follows
  followingId: string; // user being followed
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
