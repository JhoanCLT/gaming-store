import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todos los productos (IMS - Inventory Management)
export const getProducts = async (req, res) => {
  try {
    const { 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1, 
      limit = 10 
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Construir filtros
    const where = {
      isActive: true
    };
    
    if (category) {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Configurar ordenamiento
    const orderBy = {};
    const sortField = sortBy === 'name' ? 'name' : 
                    sortBy === 'price' ? 'price' :
                    sortBy === 'stock' ? 'stock' : 'createdAt';
    
    orderBy[sortField] = sortOrder === 'asc' ? 'asc' : 'desc';

    const products = await prisma.product.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy
    });

    const total = await prisma.product.count({ where });

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener producto por ID (IMS)
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear nuevo producto (IMS - Solo administradores)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, image } = req.body;

    // Validaciones básicas
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Nombre, precio y categoría son requeridos' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        category,
        image
      }
    });

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product
    });
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar producto (IMS - Solo administradores)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category, image, isActive } = req.body;

    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        stock: stock ? parseInt(stock) : undefined,
        category,
        image,
        isActive: isActive !== undefined ? isActive : undefined
      }
    });

    res.json({
      message: 'Producto actualizado exitosamente',
      product
    });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar producto (soft delete - IMS)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({
      message: 'Producto eliminado exitosamente',
      product
    });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener estadísticas de inventario (MIS - Business Intelligence)
export const getInventoryStats = async (req, res) => {
  try {
    const totalProducts = await prisma.product.count({
      where: { isActive: true }
    });
    
    const lowStockProducts = await prisma.product.count({
      where: {
        isActive: true,
        stock: { lt: 10 }
      }
    });
    
    const totalStockValue = await prisma.product.aggregate({
      where: { isActive: true },
      _sum: {
        stock: true,
        price: true
      }
    });
    
    const categories = await prisma.product.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: {
        id: true
      },
      _sum: {
        stock: true
      }
    });

    res.json({
      stats: {
        totalProducts,
        lowStockProducts,
        totalStock: totalStockValue._sum.stock || 0,
        categories
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
