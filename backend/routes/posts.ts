import { Router, Request, Response } from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  deletePost,
  toggleLikePost
} from '../db/mongo';

const router = Router();

// GET posts feed
router.get('/', async (req: Request, res: Response) => {
  try {
    const feedType = req.query.feedType as 'all' | 'following' | 'trending' | undefined;
    const tag = req.query.tag as string | undefined;
    const authorId = req.query.authorId as string | undefined;
    const currentUserId = req.query.currentUserId as string | undefined;

    const posts = await getPosts({
      feedType,
      tag,
      authorId,
      currentUserId
    });

    res.json({ success: true, data: posts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET post by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const post = await getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    res.json({ success: true, data: post });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE new post
router.post('/', async (req: Request, res: Response) => {
  try {
    const { authorId, content, mediaUrl, tags } = req.body;
    if (!authorId || !content?.trim()) {
      return res.status(400).json({ success: false, error: 'Author and content are required' });
    }

    // Auto extract tags from hashtags if not explicitly provided
    let finalTags: string[] = tags || [];
    if (finalTags.length === 0) {
      const extracted = content.match(/#(\w+)/g);
      if (extracted) {
        finalTags = extracted.map((t: string) => t.replace('#', ''));
      }
    }

    const newPost = await createPost({
      authorId,
      content,
      mediaUrl,
      tags: finalTags
    });

    res.status(201).json({ success: true, data: newPost });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// TOGGLE LIKE post
router.post('/:id/like', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }
    const result = await toggleLikePost(req.params.id, userId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE post
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { authorId } = req.body;
    const deleted = await deletePost(req.params.id, authorId);
    if (!deleted) {
      return res.status(400).json({ success: false, error: 'Failed to delete post or unauthorized' });
    }
    res.json({ success: true, data: { deleted: true } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
