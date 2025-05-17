import express from 'express';
import {
getCart,
addToCart,
updateCartItem,
removeFromCart,
} from '../controllers/cart.controllers.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/:id', protect, updateCartItem);
router.delete('/:id', protect, removeFromCart);

export default router;