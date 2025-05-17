import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlist.controllers.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getWishlist);
router.post('/', protect, addToWishlist);
router.delete('/:productId', protect, removeFromWishlist);

export default router;
