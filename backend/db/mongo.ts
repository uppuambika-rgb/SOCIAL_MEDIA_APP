import mongoose from 'mongoose';
import { IUser, IPost, IComment, IFollow, IDBStatus } from '../models/types';
import { MongoUser, MongoPost, MongoComment, MongoFollow } from '../models/schemas';
import { INITIAL_USERS, INITIAL_POSTS, INITIAL_COMMENTS, INITIAL_FOLLOWS } from './seedData';

// In-Memory store as resilient fallback & instant local responsiveness
let inMemoryUsers: IUser[] = JSON.parse(JSON.stringify(INITIAL_USERS));
let inMemoryPosts: IPost[] = JSON.parse(JSON.stringify(INITIAL_POSTS));
let inMemoryComments: IComment[] = JSON.parse(JSON.stringify(INITIAL_COMMENTS));
let inMemoryFollows: IFollow[] = JSON.parse(JSON.stringify(INITIAL_FOLLOWS));

let isConnectedToMongo = false;
let currentMongoUri = process.env.MONGODB_URI || '';
let connectionError = '';

/**
 * Initialize connection to MongoDB if URI is provided
 */
export async function initMongoDB(customUri?: string): Promise<{ success: boolean; message: string }> {
  const uriToUse = customUri || currentMongoUri;
  if (!uriToUse || uriToUse === 'MY_MONGODB_URI' || uriToUse.includes('<username>')) {
    isConnectedToMongo = false;
    return {
      success: false,
      message: 'MongoDB URI not provided or using placeholder. Running in high-performance local store mode.'
    };
  }

  try {
    currentMongoUri = uriToUse;
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    await mongoose.connect(uriToUse, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnectedToMongo = true;
    connectionError = '';

    // Seed if empty
    const userCount = await MongoUser.countDocuments();
    if (userCount === 0) {
      await MongoUser.insertMany(inMemoryUsers);
      await MongoPost.insertMany(inMemoryPosts);
      await MongoComment.insertMany(inMemoryComments);
      await MongoFollow.insertMany(inMemoryFollows);
    }

    return { success: true, message: 'Successfully connected to MongoDB cluster.' };
  } catch (err: any) {
    isConnectedToMongo = false;
    connectionError = err.message || 'Failed to connect to MongoDB';
    return { success: false, message: connectionError };
  }
}

// Auto-init on boot
if (currentMongoUri && currentMongoUri !== 'MY_MONGODB_URI' && !currentMongoUri.includes('<username>')) {
  initMongoDB().catch(() => {
    // Graceful fallback to memory mode
  });
}

/**
 * Database Status
 */
export async function getSystemStatus(): Promise<IDBStatus> {
  const maskedUri = currentMongoUri
    ? currentMongoUri.replace(/:([^@]+)@/, ':****@')
    : undefined;

  if (isConnectedToMongo && mongoose.connection.readyState === 1) {
    try {
      const users = await MongoUser.countDocuments();
      const posts = await MongoPost.countDocuments();
      const comments = await MongoComment.countDocuments();
      const follows = await MongoFollow.countDocuments();

      return {
        connected: true,
        mode: 'mongodb',
        statusText: 'Connected to MongoDB Atlas / Cluster',
        mongoUriMasked: maskedUri,
        stats: { users, posts, comments, follows }
      };
    } catch (e) {
      // Fallback
    }
  }

  return {
    connected: false,
    mode: 'memory',
    statusText: connectionError ? `MongoDB Connection Error: ${connectionError}` : 'Local Database Active (MongoDB URL ready to connect)',
    mongoUriMasked: maskedUri,
    stats: {
      users: inMemoryUsers.length,
      posts: inMemoryPosts.length,
      comments: inMemoryComments.length,
      follows: inMemoryFollows.length
    }
  };
}

// Helper to populate author
function populateAuthor(post: IPost): IPost {
  const author = inMemoryUsers.find(u => u.id === post.authorId);
  return { ...post, author };
}

/**
 * USER OPERATIONS
 */
export async function getUsers(): Promise<IUser[]> {
  if (isConnectedToMongo) {
    try {
      const users = await MongoUser.find().lean();
      return users.map((u: any) => ({
        id: u.id,
        username: u.username,
        handle: u.handle,
        displayName: u.displayName,
        avatar: u.avatar,
        banner: u.banner,
        bio: u.bio,
        location: u.location,
        website: u.website,
        badge: u.badge,
        followersCount: u.followersCount,
        followingCount: u.followingCount,
        postsCount: u.postsCount,
        createdAt: u.createdAt
      }));
    } catch (e) {
      // fallback to memory
    }
  }
  return [...inMemoryUsers];
}

export async function getUserById(idOrUsername: string): Promise<IUser | null> {
  if (isConnectedToMongo) {
    try {
      const user = await MongoUser.findOne({
        $or: [{ id: idOrUsername }, { username: idOrUsername }, { handle: idOrUsername }]
      }).lean();
      if (user) {
        return {
          id: (user as any).id,
          username: (user as any).username,
          handle: (user as any).handle,
          displayName: (user as any).displayName,
          avatar: (user as any).avatar,
          banner: (user as any).banner,
          bio: (user as any).bio,
          location: (user as any).location,
          website: (user as any).website,
          badge: (user as any).badge,
          followersCount: (user as any).followersCount,
          followingCount: (user as any).followingCount,
          postsCount: (user as any).postsCount,
          createdAt: (user as any).createdAt
        };
      }
    } catch (e) {
      // fallback
    }
  }

  const u = inMemoryUsers.find(
    user => user.id === idOrUsername || user.username.toLowerCase() === idOrUsername.toLowerCase() || user.handle.toLowerCase() === idOrUsername.toLowerCase()
  );
  return u ? { ...u } : null;
}

export async function updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
  if (isConnectedToMongo) {
    try {
      await MongoUser.updateOne({ id }, { $set: updates });
      return await getUserById(id);
    } catch (e) {
      // fallback
    }
  }

  const index = inMemoryUsers.findIndex(u => u.id === id);
  if (index === -1) return null;
  inMemoryUsers[index] = { ...inMemoryUsers[index], ...updates };
  return { ...inMemoryUsers[index] };
}

/**
 * POST OPERATIONS
 */
export async function getPosts(options: {
  feedType?: 'all' | 'following' | 'trending';
  tag?: string;
  authorId?: string;
  currentUserId?: string;
}): Promise<IPost[]> {
  const { feedType = 'all', tag, authorId, currentUserId } = options;

  let posts: IPost[] = [];

  if (isConnectedToMongo) {
    try {
      const query: any = {};
      if (authorId) {
        query.authorId = authorId;
      }
      if (tag) {
        query.tags = tag;
      }
      if (feedType === 'following' && currentUserId) {
        const follows = await MongoFollow.find({ followerId: currentUserId }).lean();
        const followingIds = follows.map((f: any) => f.followingId);
        query.authorId = { $in: [...followingIds, currentUserId] };
      }

      let mongoPosts = await MongoPost.find(query)
        .sort(feedType === 'trending' ? { likesCount: -1, createdAt: -1 } : { createdAt: -1 })
        .lean();

      const userMap = new Map();
      const users = await getUsers();
      users.forEach(u => userMap.set(u.id, u));

      posts = mongoPosts.map((p: any) => ({
        id: p.id,
        authorId: p.authorId,
        author: userMap.get(p.authorId),
        content: p.content,
        mediaUrl: p.mediaUrl,
        tags: p.tags || [],
        likesCount: p.likesCount || 0,
        likedBy: p.likedBy || [],
        commentsCount: p.commentsCount || 0,
        createdAt: p.createdAt
      }));

      return posts;
    } catch (e) {
      // fallback to memory
    }
  }

  let list = [...inMemoryPosts];

  if (authorId) {
    list = list.filter(p => p.authorId === authorId);
  }
  if (tag) {
    list = list.filter(p => p.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
  }
  if (feedType === 'following' && currentUserId) {
    const followingIds = inMemoryFollows
      .filter(f => f.followerId === currentUserId)
      .map(f => f.followingId);
    list = list.filter(p => p.authorId === currentUserId || followingIds.includes(p.authorId));
  } else if (feedType === 'trending') {
    list.sort((a, b) => b.likesCount - a.likesCount);
  } else {
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return list.map(populateAuthor);
}

export async function getPostById(id: string): Promise<IPost | null> {
  const post = inMemoryPosts.find(p => p.id === id);
  return post ? populateAuthor(post) : null;
}

export async function createPost(data: {
  authorId: string;
  content: string;
  mediaUrl?: string;
  tags?: string[];
}): Promise<IPost> {
  const newPost: IPost = {
    id: `post_${Date.now()}`,
    authorId: data.authorId,
    content: data.content,
    mediaUrl: data.mediaUrl || '',
    tags: data.tags || [],
    likesCount: 0,
    likedBy: [],
    commentsCount: 0,
    createdAt: new Date().toISOString()
  };

  inMemoryPosts.unshift(newPost);

  // Update user post count
  const author = inMemoryUsers.find(u => u.id === data.authorId);
  if (author) {
    author.postsCount = (author.postsCount || 0) + 1;
  }

  if (isConnectedToMongo) {
    try {
      await MongoPost.create(newPost);
      await MongoUser.updateOne({ id: data.authorId }, { $inc: { postsCount: 1 } });
    } catch (e) {
      // ignore
    }
  }

  return populateAuthor(newPost);
}

export async function toggleLikePost(postId: string, userId: string): Promise<{ liked: boolean; likesCount: number }> {
  const post = inMemoryPosts.find(p => p.id === postId);
  if (!post) throw new Error('Post not found');

  const alreadyLiked = post.likedBy.includes(userId);
  if (alreadyLiked) {
    post.likedBy = post.likedBy.filter(id => id !== userId);
    post.likesCount = Math.max(0, post.likesCount - 1);
  } else {
    post.likedBy.push(userId);
    post.likesCount += 1;
  }

  if (isConnectedToMongo) {
    try {
      if (alreadyLiked) {
        await MongoPost.updateOne({ id: postId }, { $pull: { likedBy: userId }, $inc: { likesCount: -1 } });
      } else {
        await MongoPost.updateOne({ id: postId }, { $addToSet: { likedBy: userId }, $inc: { likesCount: 1 } });
      }
    } catch (e) {
      // ignore
    }
  }

  return { liked: !alreadyLiked, likesCount: post.likesCount };
}

export async function deletePost(postId: string, authorId: string): Promise<boolean> {
  const index = inMemoryPosts.findIndex(p => p.id === postId && p.authorId === authorId);
  if (index === -1) return false;

  inMemoryPosts.splice(index, 1);
  // delete comments
  inMemoryComments = inMemoryComments.filter(c => c.postId !== postId);

  // Decrement user posts count
  const author = inMemoryUsers.find(u => u.id === authorId);
  if (author && author.postsCount > 0) {
    author.postsCount -= 1;
  }

  if (isConnectedToMongo) {
    try {
      await MongoPost.deleteOne({ id: postId, authorId });
      await MongoComment.deleteMany({ postId });
      await MongoUser.updateOne({ id: authorId }, { $inc: { postsCount: -1 } });
    } catch (e) {
      // ignore
    }
  }

  return true;
}

/**
 * COMMENT OPERATIONS
 */
export async function getComments(postId: string): Promise<IComment[]> {
  const comments = inMemoryComments.filter(c => c.postId === postId);
  comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return comments.map(comm => {
    const author = inMemoryUsers.find(u => u.id === comm.authorId);
    return { ...comm, author };
  });
}

export async function createComment(data: {
  postId: string;
  authorId: string;
  content: string;
}): Promise<IComment> {
  const post = inMemoryPosts.find(p => p.id === data.postId);
  if (!post) throw new Error('Post not found');

  const newComment: IComment = {
    id: `comm_${Date.now()}`,
    postId: data.postId,
    authorId: data.authorId,
    content: data.content,
    likesCount: 0,
    likedBy: [],
    createdAt: new Date().toISOString()
  };

  inMemoryComments.push(newComment);
  post.commentsCount = (post.commentsCount || 0) + 1;

  if (isConnectedToMongo) {
    try {
      await MongoComment.create(newComment);
      await MongoPost.updateOne({ id: data.postId }, { $inc: { commentsCount: 1 } });
    } catch (e) {
      // ignore
    }
  }

  const author = inMemoryUsers.find(u => u.id === data.authorId);
  return { ...newComment, author };
}

export async function toggleLikeComment(commentId: string, userId: string): Promise<{ liked: boolean; likesCount: number }> {
  const comment = inMemoryComments.find(c => c.id === commentId);
  if (!comment) throw new Error('Comment not found');

  const alreadyLiked = comment.likedBy.includes(userId);
  if (alreadyLiked) {
    comment.likedBy = comment.likedBy.filter(id => id !== userId);
    comment.likesCount = Math.max(0, comment.likesCount - 1);
  } else {
    comment.likedBy.push(userId);
    comment.likesCount += 1;
  }

  if (isConnectedToMongo) {
    try {
      if (alreadyLiked) {
        await MongoComment.updateOne({ id: commentId }, { $pull: { likedBy: userId }, $inc: { likesCount: -1 } });
      } else {
        await MongoComment.updateOne({ id: commentId }, { $addToSet: { likedBy: userId }, $inc: { likesCount: 1 } });
      }
    } catch (e) {
      // ignore
    }
  }

  return { liked: !alreadyLiked, likesCount: comment.likesCount };
}

/**
 * FOLLOW OPERATIONS
 */
export async function toggleFollow(followerId: string, followingId: string): Promise<{ following: boolean; followersCount: number }> {
  if (followerId === followingId) {
    throw new Error('You cannot follow yourself');
  }

  const existingIndex = inMemoryFollows.findIndex(
    f => f.followerId === followerId && f.followingId === followingId
  );

  const targetUser = inMemoryUsers.find(u => u.id === followingId);
  const currentUser = inMemoryUsers.find(u => u.id === followerId);

  if (!targetUser || !currentUser) {
    throw new Error('User not found');
  }

  const isFollowing = existingIndex !== -1;

  if (isFollowing) {
    // Unfollow
    inMemoryFollows.splice(existingIndex, 1);
    targetUser.followersCount = Math.max(0, targetUser.followersCount - 1);
    currentUser.followingCount = Math.max(0, currentUser.followingCount - 1);

    if (isConnectedToMongo) {
      try {
        await MongoFollow.deleteOne({ followerId, followingId });
        await MongoUser.updateOne({ id: followingId }, { $inc: { followersCount: -1 } });
        await MongoUser.updateOne({ id: followerId }, { $inc: { followingCount: -1 } });
      } catch (e) {
        // ignore
      }
    }

    return { following: false, followersCount: targetUser.followersCount };
  } else {
    // Follow
    const newFollow: IFollow = {
      id: `f_${Date.now()}`,
      followerId,
      followingId,
      createdAt: new Date().toISOString()
    };
    inMemoryFollows.push(newFollow);
    targetUser.followersCount += 1;
    currentUser.followingCount += 1;

    if (isConnectedToMongo) {
      try {
        await MongoFollow.create(newFollow);
        await MongoUser.updateOne({ id: followingId }, { $inc: { followersCount: 1 } });
        await MongoUser.updateOne({ id: followerId }, { $inc: { followingCount: 1 } });
      } catch (e) {
        // ignore
      }
    }

    return { following: true, followersCount: targetUser.followersCount };
  }
}

export async function getFollowers(userId: string): Promise<IUser[]> {
  const followRecords = inMemoryFollows.filter(f => f.followingId === userId);
  const followerIds = followRecords.map(f => f.followerId);
  return inMemoryUsers.filter(u => followerIds.includes(u.id));
}

export async function getFollowing(userId: string): Promise<IUser[]> {
  const followRecords = inMemoryFollows.filter(f => f.followerId === userId);
  const followingIds = followRecords.map(f => f.followingId);
  return inMemoryUsers.filter(u => followingIds.includes(u.id));
}

export async function isFollowingUser(followerId: string, followingId: string): Promise<boolean> {
  return inMemoryFollows.some(f => f.followerId === followerId && f.followingId === followingId);
}
