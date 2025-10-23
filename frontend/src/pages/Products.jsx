import React, { useState, useEffect, useCallback } from 'react';
import { productsAPI, salesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, Plus, Edit, Trash2, Search, Filter, SlidersHorizontal, Check } from 'lucide-react';
import ProductModal from '../components/ProductModal';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { user } = useAuth();
  const { addToCart } = useCart();

  const categories = ['Periféricos', 'Componentes', 'Sillas Gaming', 'Monitores', 'Audio', 'Accesorios'];
  const sortOptions = [
    { value: 'name', label: 'Nombre' },
    { value: 'price', label: 'Precio' },
    { value: 'stock', label: 'Stock' },
    { value: 'createdAt', label: 'Fecha' }
  ];

  // Cargar productos cuando se apliquen los filtros
  useEffect(() => {
    loadProducts();
  }, [appliedFilters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      // Limpiar parámetros undefined
      const params = { ...appliedFilters };
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await productsAPI.getAll(params);
      setProducts(response.data.products);
    } catch (err) {
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const handlePurchase = async (product) => {
    if (!user) {
      setError('Debes iniciar sesión para comprar');
      return;
    }

    try {
      addToCart(product);
      setError('');
    } catch (err) {
      setError('Error al agregar al carrito');
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, productData);
      } else {
        await productsAPI.create(productData);
      }
      
      setShowModal(false);
      setEditingProduct(null);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el producto');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      await productsAPI.delete(productId);
      loadProducts();
    } catch (err) {
      setError('Error al eliminar el producto');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'name',
      sortOrder: 'asc'
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 rounded-full animate-spin border-gaming-primary"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8 lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Productos Gaming</h1>
            <p className="mt-2 text-sm text-gray-600 lg:text-base">
              Encuentra los mejores productos para tu setup gaming
            </p>
          </div>

          {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
            <button 
              onClick={openCreateModal}
              className="flex items-center justify-center w-full space-x-2 btn-primary lg:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Producto</span>
            </button>
          )}
        </div>

        {/* Filtros y Búsqueda */}
        <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Búsqueda Básica */}
          <div className="flex flex-col gap-4 mb-4 md:flex-row">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Buscar productos por nombre o descripción..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-gaming-primary focus:border-gaming-primary"
                />
              </div>
            </form>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center space-x-2 btn-secondary"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtros</span>
            </button>

            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Limpiar
            </button>
          </div>

          {/* Filtros Avanzados */}
          {showAdvancedFilters && (
            <div className="pt-4 border-t">
              <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-4">
                {/* Categoría */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Categoría
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-gaming-primary focus:border-gaming-primary"
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Precio Mínimo */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Precio Mínimo
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-gaming-primary focus:border-gaming-primary"
                  />
                </div>

                {/* Precio Máximo */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Precio Máximo
                  </label>
                  <input
                    type="number"
                    placeholder="9999"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-gaming-primary focus:border-gaming-primary"
                  />
                </div>

                {/* Ordenar */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Ordenar por
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-gaming-primary focus:border-gaming-primary"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      {filters.sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Botón Aplicar Filtros */}
              <div className="flex justify-end">
                <button
                  onClick={applyFilters}
                  className="flex items-center space-x-2 btn-primary"
                >
                  <Check className="w-4 h-4" />
                  <span>Aplicar Filtros</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="px-4 py-3 mb-6 text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        {/* Información de Resultados */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">
            {products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
          </p>
          
          {/* Mostrar filtros activos */}
          {(appliedFilters.search || appliedFilters.category || appliedFilters.minPrice || appliedFilters.maxPrice) && (
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600">Filtros activos:</span>
              {appliedFilters.search && (
                <span className="px-2 py-1 text-blue-800 bg-blue-100 rounded">Buscar: "{appliedFilters.search}"</span>
              )}
              {appliedFilters.category && (
                <span className="px-2 py-1 text-green-800 bg-green-100 rounded">Categoría: {appliedFilters.category}</span>
              )}
              {(appliedFilters.minPrice || appliedFilters.maxPrice) && (
                <span className="px-2 py-1 text-purple-800 bg-purple-100 rounded">
                  Precio: {appliedFilters.minPrice || '0'} - {appliedFilters.maxPrice || '∞'}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="transition-shadow card hover:shadow-lg">
              <div className="flex items-center justify-center h-48 mb-4 bg-gray-200 rounded-lg aspect-w-16 aspect-h-9">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full rounded-lg"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-2" />
                    <span>Sin imagen</span>
                  </div>
                )}
              </div>
              
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {product.name}
              </h3>
              
              <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-gaming-primary">
                  ${product.price}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.stock > 10 
                    ? 'bg-green-100 text-green-800'
                    : product.stock > 0
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  Stock: {product.stock}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="px-2 py-1 text-sm text-gray-500 bg-gray-100 rounded">
                  {product.category}
                </span>
                
                {user ? (
                  (user.role === 'ADMIN' || user.role === 'MANAGER') ? (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openEditModal(product)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handlePurchase(product)}
                      disabled={product.stock === 0}
                      className="px-3 py-1 text-sm btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                    </button>
                  )
                ) : (
                  <button 
                    onClick={() => setError('Debes iniciar sesión para comprar')}
                    className="px-3 py-1 text-sm btn-primary"
                  >
                    Agregar al Carrito
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="py-12 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No se encontraron productos
            </h3>
            <p className="mb-4 text-gray-600">
              Intenta ajustar los filtros de búsqueda
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Mostrar Todos los Productos
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <ProductModal
            product={editingProduct}
            onSave={handleSaveProduct}
            onClose={() => {
              setShowModal(false);
              setEditingProduct(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Products;