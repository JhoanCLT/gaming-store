import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Gamepad2, Cpu, Headphones, Zap } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Bienvenido a{' '}
            <span className="text-gaming-accent">Gaming Store</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Los mejores productos gaming para jugadores profesionales
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/products" className="btn-primary text-lg px-8 py-3">
              Ver Productos
            </Link>
            {!user && (
              <Link to="/register" className="btn-secondary text-lg px-8 py-3">
                Crear Cuenta
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegirnos?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Cpu className="h-12 w-12 text-gaming-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tecnología de Vanguardia</h3>
              <p className="text-gray-400">
                Los componentes más avanzados para maximizar tu rendimiento gaming
              </p>
            </div>
            <div className="text-center">
              <Zap className="h-12 w-12 text-gaming-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
              <p className="text-gray-400">
                Envío express para que recibas tu equipo lo antes posible
              </p>
            </div>
            <div className="text-center">
              <Headphones className="h-12 w-12 text-gaming-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Soporte 24/7</h3>
              <p className="text-gray-400">
                Nuestro equipo de soporte está siempre disponible para ayudarte
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Systems Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Sistemas Integrados</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card bg-gray-800">
              <h3 className="text-xl font-semibold mb-2 text-gaming-primary">TPS</h3>
              <p className="text-gray-400">Sistema de Procesamiento de Transacciones</p>
            </div>
            <div className="card bg-gray-800">
              <h3 className="text-xl font-semibold mb-2 text-gaming-primary">IMS</h3>
              <p className="text-gray-400">Sistema de Gestión de Inventario</p>
            </div>
            <div className="card bg-gray-800">
              <h3 className="text-xl font-semibold mb-2 text-gaming-primary">CRM</h3>
              <p className="text-gray-400">Gestión de Relaciones con Clientes</p>
            </div>
            <div className="card bg-gray-800">
              <h3 className="text-xl font-semibold mb-2 text-gaming-primary">ERP</h3>
              <p className="text-gray-400">Planificación de Recursos Empresariales</p>
            </div>
            <div className="card bg-gray-800">
              <h3 className="text-xl font-semibold mb-2 text-gaming-primary">CMS</h3>
              <p className="text-gray-400">Sistema de Gestión de Contenidos</p>
            </div>
            <div className="card bg-gray-800">
              <h3 className="text-xl font-semibold mb-2 text-gaming-primary">MIS</h3>
              <p className="text-gray-400">Sistema de Información Gerencial</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
