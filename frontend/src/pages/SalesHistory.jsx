import React, { useState, useEffect } from 'react';
import { salesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Search, Filter, FileText } from 'lucide-react';

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10
  });
  const { user } = useAuth();

  useEffect(() => {
    loadSales();
  }, [filters]);

  const loadSales = async () => {
    try {
      const params = { ...filters };
      // Usar el endpoint correcto según el rol
      const endpoint = user?.role === 'CUSTOMER' ? salesAPI.getMySales : salesAPI.getAll;
      const response = await endpoint(params);
      setSales(response.data.sales || []);
    } catch (error) {
      console.error('Error loading sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      COMPLETED: { color: 'bg-green-100 text-green-800', text: 'Completada' },
      PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
      CANCELLED: { color: 'bg-red-100 text-red-800', text: 'Cancelada' }
    };
    
    const config = statusConfig[status] || statusConfig.COMPLETED;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getPaymentMethodBadge = (method) => {
    const methodConfig = {
      CASH: { color: 'bg-gray-100 text-gray-800', text: 'Efectivo' },
      CARD: { color: 'bg-blue-100 text-blue-800', text: 'Tarjeta' },
      TRANSFER: { color: 'bg-purple-100 text-purple-800', text: 'Transferencia' },
      CRYPTO: { color: 'bg-orange-100 text-orange-800', text: 'Cripto' }
    };
    
    const config = methodConfig[method] || methodConfig.CARD;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 rounded-full animate-spin border-gaming-primary"></div>
          <p className="mt-4 text-gray-600">Cargando historial de ventas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.role === 'CUSTOMER' ? 'Mis Compras' : 'Historial de Ventas'}
            </h1>
            <p className="mt-2 text-gray-600">
              {user?.role === 'CUSTOMER' 
                ? 'Revisa tu historial de compras' 
                : 'Gestión completa de ventas del sistema'
              }
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 card">
          <div className="flex items-center mb-4 space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-medium">Filtros</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gaming-primary focus:border-gaming-primary"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Fecha Fin
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gaming-primary focus:border-gaming-primary"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Items por página
              </label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gaming-primary focus:border-gaming-primary"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Ventas */}
        <div className="card">
          {sales.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No hay ventas registradas
              </h3>
              <p className="text-gray-600">
                {user?.role === 'CUSTOMER' 
                  ? 'Aún no has realizado ninguna compra' 
                  : 'No se han realizado ventas en el sistema'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {sales.map((sale) => (
                <div key={sale.id} className="pb-6 border-b border-gray-200 last:border-b-0">
                  {/* Header de la Venta */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Venta #{sale.id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        <Calendar className="inline w-4 h-4 mr-1" />
                        {formatDate(sale.createdAt)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gaming-primary">
                        ${sale.total}
                      </p>
                      <div className="flex items-center mt-1 space-x-2">
                        {getStatusBadge(sale.status)}
                        {getPaymentMethodBadge(sale.paymentMethod)}
                      </div>
                    </div>
                  </div>

                  {/* Información del Cliente (solo para admin/manager) */}
                  {user?.role !== 'CUSTOMER' && sale.user && (
                    <div className="p-3 mb-3 rounded-lg bg-gray-50">
                      <p className="text-sm text-gray-600">
                        <strong>Cliente:</strong> {sale.user.name} ({sale.user.email})
                      </p>
                    </div>
                  )}

                  {/* Items de la Venta */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Productos:</h4>
                    {sale.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between px-3 py-2 rounded bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.product?.name || 'Producto no disponible'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} x ${item.price}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ${item.subtotal}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesHistory;