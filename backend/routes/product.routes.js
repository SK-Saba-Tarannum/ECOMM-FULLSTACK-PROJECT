import express from 'express';
import {
    getSingleProduct,
getAllProducts,
createProduct,
updateProduct,
deleteProduct,
} from '../controllers/product.controllers.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getSingleProduct);

router.post('/', protect, authorizeRoles('SELLER'), createProduct);
router.put('/:id', protect, authorizeRoles('SELLER'), updateProduct);
router.delete('/:id', protect, authorizeRoles('SELLER'), deleteProduct);

export default router;

