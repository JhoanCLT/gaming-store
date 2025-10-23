import React, { useState, useEffect } from 'react';
import { productsAPI, salesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import SalesChart from '../components/Charts/SalesChart';
import ProductsChart from '../components/Charts/ProductsChart';
import PaymentMethodsChart from '../components/Charts/PaymentMethodsChart';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.role === 'MANAGER')) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [productsResponse, salesResponse] = await Promise.all([
        productsAPI.getStats(),
        salesAPI.getStats()
      ]);

      setStats({
        products: productsResponse.data.stats,
        sales: salesResponse.data.stats
      });

      // Datos de ejemplo para gráficos (en un sistema real vendrían del backend)
      setChartData({
        salesByDate: generateSalesData(),
        productsByCategory: generateProductsData(productsResponse.data.stats),
        paymentMethods: generatePaymentMethodsData(salesResponse.data.stats)
      });

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Datos de ejemplo para gráficos
  const generateSalesData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        total: Math.floor(Math.random() * 1000) + 200
      });
    }
    return data;
  };

  const generateProductsData = (productsStats) => {
    if (!productsStats?.categories) return [];
    return productsStats.categories.map(cat => ({
      category: cat.category,
      count: cat._count.id,
      stock: cat._sum.stock
    }));
  };

  const generatePaymentMethodsData = (salesStats) => {
    if (!salesStats?.salesByPaymentMethod) return [];
    return salesStats.salesByPaymentMethod.map(item => ({
      method: item.paymentMethod,
      count: item._count.id,
      total: item._sum.total
    }));
  };

  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Acceso Denegado</h2>
          <p className="text-gray-600">
            No tienes permisos para acceder al dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 rounded-full animate-spin border-gaming-primary"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex items-center mb-8 space-x-3">
          <BarChart3 className="w-8 h-8 text-gaming-primary" />
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Analytics</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Productos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.products?.totalProducts || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Ventas</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.sales?.totalSales || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${stats.sales?.totalRevenue || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.products?.lowStockProducts || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 gap-6 mb-8 xl:grid-cols-2">
          <SalesChart data={chartData} />
          <ProductsChart data={chartData} />
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
          <PaymentMethodsChart data={chartData} />
          
          {/* Recent Sales */}
          <div className="card">
            <h2 className="mb-4 text-xl font-semibold">Ventas Recientes</h2>
            <div className="space-y-4">
              {stats.sales?.recentSales?.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between pb-3 border-b">
                  <div>
                    <p className="font-medium">Venta #{sale.id.slice(-6)}</p>
                    <p className="text-sm text-gray-600">{sale.user?.name || 'Cliente'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${sale.total}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {(!stats.sales?.recentSales || stats.sales.recentSales.length === 0) && (
                <p className="py-4 text-center text-gray-500">No hay ventas recientes</p>
              )}
            </div>
          </div>
        </div>

        {/* Inventory Summary */}
        <div className="card">
          <h2 className="mb-4 text-xl font-semibold">Resumen de Inventario por Categoría</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stats.products?.categories?.map((category) => (
              <div key={category.category} className="p-4 rounded-lg bg-gray-50">
                <h3 className="mb-2 font-semibold text-gray-900">{category.category}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Productos: {category._count.id}</p>
                  <p>Stock total: {category._sum.stock}</p>
                </div>
              </div>
            ))}
            {(!stats.products?.categories || stats.products.categories.length === 0) && (
              <p className="col-span-3 py-4 text-center text-gray-500">No hay categorías</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;