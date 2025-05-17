import express from 'express';
import { createOrder, getMyOrders } from '../controllers/order.controllers.js';
import { protect } from '../middleware/auth.middleware.js';
import { getUserOrders, getOrderById } from '../controllers/order.controllers.js';



const router = express.Router();
router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/my-orders', protect, getUserOrders);
router.get('/:orderId', protect, getOrderById);


export default router;

