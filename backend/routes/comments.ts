import { Router, Request, Response } from 'express';
import {
  getComments,
  createComment,
  toggleLikeComment
} from '../db/mongo';

const router = Router();

// GET comments for a post
router.get('/', async (req: Request, res: Response) => {
  try {
    const postId = req.query.postId as string;
    if (!postId) {
      return res.status(400).json({ success: false, error: 'postId query parameter is required' });
    }
    const comments = await getComments(postId);
    res.json({ success: true, data: comments });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE comment
router.post('/', async (req: Request, res: Response) => {
  try {
    const { postId, authorId, content } = req.body;
    if (!postId || !authorId || !content?.trim()) {
      return res.status(400).json({ success: false, error: 'postId, authorId, and content are required' });
    }
    const newComment = await createComment({ postId, authorId, content: content.trim() });
    res.status(201).json({ success: true, data: newComment });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// TOGGLE LIKE comment
router.post('/:id/like', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }
    const result = await toggleLikeComment(req.params.id, userId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
