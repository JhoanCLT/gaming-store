import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Procesar una nueva venta (TPS - Transaction Processing)
export const createSale = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;
    const userId = req.user.id;

    // Validaciones
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items de venta requeridos' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ error: 'Método de pago requerido' });
    }

    // Calcular total y verificar stock
    let total = 0;
    const productUpdates = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return res.status(404).json({ error: `Producto ${item.productId} no encontrado` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}, Solicitado: ${item.quantity}` 
        });
      }

      const subtotal = product.price * item.quantity;
      total += subtotal;

      // Preparar actualización de stock
      productUpdates.push({
        where: { id: item.productId },
        data: { stock: product.stock - item.quantity }
      });
    }

    // Usar transacción para asegurar consistencia (TPS)
    const result = await prisma.$transaction(async (tx) => {
      // 1. Crear la venta
      const sale = await tx.sale.create({
        data: {
          total,
          paymentMethod,
          userId,
          items: {
            create: items.map(item => ({
              quantity: item.quantity,
              price: item.price,
              subtotal: item.price * item.quantity,
              productId: item.productId
            }))
          }
        },
        include: {
          items: {
            include: {
              product: {
                select: { name: true, category: true }
              }
            }
          },
          user: {
            select: { name: true, email: true }
          }
        }
      });

      // 2. Actualizar stock de productos
      for (const update of productUpdates) {
        await tx.product.update(update);
      }

      return sale;
    });

    res.status(201).json({
      message: 'Venta procesada exitosamente',
      sale: result
    });

  } catch (error) {
    console.error('Error procesando venta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener todas las ventas (MIS - Reporting)
export const getSales = async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    // Si es un cliente, solo mostrar sus ventas
    if (req.user.role === 'CUSTOMER') {
      where.userId = req.user.id;
    }
    
    // Filtrar por fecha si se proporciona
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const sales = await prisma.sale.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        },
        items: {
          include: {
            product: {
              select: { name: true, category: true }
            }
          }
        }
      }
    });

    const total = await prisma.sale.count({ where });

    res.json({
      sales,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error obteniendo ventas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener venta por ID
export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true }
        },
        items: {
          include: {
            product: {
              select: { name: true, category: true, price: true }
            }
          }
        }
      }
    });

    if (!sale) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    res.json({ sale });
  } catch (error) {
    console.error('Error obteniendo venta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener estadísticas de ventas (MIS - Business Intelligence)
export const getSalesStats = async (req, res) => {
  try {
    const totalSales = await prisma.sale.count();
    const totalRevenue = await prisma.sale.aggregate({
      _sum: { total: true }
    });

    const salesByPaymentMethod = await prisma.sale.groupBy({
      by: ['paymentMethod'],
      _count: { id: true },
      _sum: { total: true }
    });

    const recentSales = await prisma.sale.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true }
        }
      }
    });

    res.json({
      stats: {
        totalSales,
        totalRevenue: totalRevenue._sum.total || 0,
        salesByPaymentMethod,
        recentSales
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas de ventas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
