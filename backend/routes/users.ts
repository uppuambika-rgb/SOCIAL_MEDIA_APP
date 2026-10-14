import { Router, Request, Response } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  getFollowers,
  getFollowing,
  toggleFollow,
  isFollowingUser
} from '../db/mongo';

const router = Router();

// GET all users
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET user by ID or username
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const currentUserId = req.query.currentUserId as string;
    let isFollowing = false;
    if (currentUserId && currentUserId !== user.id) {
      isFollowing = await isFollowingUser(currentUserId, user.id);
    }
    res.json({ success: true, data: { ...user, isFollowing } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE user profile
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { displayName, bio, location, website, avatar, banner } = req.body;
    const updated = await updateUser(req.params.id, {
      displayName,
      bio,
      location,
      website,
      avatar,
      banner
    });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET followers of user
router.get('/:id/followers', async (req: Request, res: Response) => {
  try {
    const followers = await getFollowers(req.params.id);
    res.json({ success: true, data: followers });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET following of user
router.get('/:id/following', async (req: Request, res: Response) => {
  try {
    const following = await getFollowing(req.params.id);
    res.json({ success: true, data: following });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// TOGGLE follow user
router.post('/:id/follow', async (req: Request, res: Response) => {
  try {
    const { followerId } = req.body;
    if (!followerId) {
      return res.status(400).json({ success: false, error: 'followerId is required' });
    }
    const result = await toggleFollow(followerId, req.params.id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
