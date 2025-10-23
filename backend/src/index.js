import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import saleRoutes from './routes/saleRoutes.js'; // ← AÑADIR ESTA LÍNEA

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes); // ← AÑADIR ESTA LÍNEA

// Rutas básicas de salud (mantener las existentes)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Gaming Store API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/system-info', (req, res) => {
  res.json({
    system: 'Gaming Store Management System',
    modules: ['TPS', 'IMS', 'CRM', 'ERP', 'CMS', 'MIS'],
    version: '1.0.0',
    environment: process.env.NODE_ENV
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📊 Sistema Gaming Store iniciado`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth routes: http://localhost:${PORT}/api/auth`);
  console.log(`🎮 Product routes: http://localhost:${PORT}/api/products`);
  console.log(`💰 Sale routes: http://localhost:${PORT}/api/sales`);
});
