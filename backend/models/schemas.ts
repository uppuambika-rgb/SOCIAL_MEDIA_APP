import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true, unique: true },
  handle: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  avatar: { type: String, default: '' },
  banner: { type: String, default: '' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  badge: { type: String, default: 'CREATOR' },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  postsCount: { type: Number, default: 0 },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

const PostSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  authorId: { type: String, required: true, index: true },
  content: { type: String, required: true },
  mediaUrl: { type: String, default: '' },
  tags: [{ type: String }],
  likesCount: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  commentsCount: { type: Number, default: 0 },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

const CommentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  postId: { type: String, required: true, index: true },
  authorId: { type: String, required: true },
  content: { type: String, required: true },
  likesCount: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

const FollowSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  followerId: { type: String, required: true, index: true },
  followingId: { type: String, required: true, index: true },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

// Prevent mongoose recompilation errors in dev
export const MongoUser = mongoose.models.User || mongoose.model('User', UserSchema);
export const MongoPost = mongoose.models.Post || mongoose.model('Post', PostSchema);
export const MongoComment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
export const MongoFollow = mongoose.models.Follow || mongoose.model('Follow', FollowSchema);
