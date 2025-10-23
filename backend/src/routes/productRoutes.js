import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getInventoryStats
} from '../controllers/productController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/', getProducts);
router.get('/stats', getInventoryStats);
router.get('/:id', getProductById);

// Rutas protegidas (solo administradores)
router.post('/', authenticateToken, requireRole(['ADMIN', 'MANAGER']), createProduct);
router.put('/:id', authenticateToken, requireRole(['ADMIN', 'MANAGER']), updateProduct);
router.delete('/:id', authenticateToken, requireRole(['ADMIN', 'MANAGER']), deleteProduct);

export default router;
