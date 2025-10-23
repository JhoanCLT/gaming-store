import express from 'express';
import {
  createSale,
  getSales,
  getSaleById,
  getSalesStats
} from '../controllers/saleController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas para clientes y administradores
router.post('/', createSale);
router.get('/my-sales', getSales); // Ventas del usuario actual
router.get('/:id', getSaleById);

// Rutas solo para administradores (MIS - Reporting)
router.get('/', requireRole(['ADMIN', 'MANAGER']), getSales);
router.get('/stats/dashboard', requireRole(['ADMIN', 'MANAGER']), getSalesStats);

export default router;