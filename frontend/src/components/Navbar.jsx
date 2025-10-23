import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, User, LogOut, Gamepad2 } from 'lucide-react';
import CartIcon from './CartIcon';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="shadow-lg bg-gaming-secondary">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-white">
            <Gamepad2 className="w-8 h-8 text-gaming-accent" />
            <span className="text-xl font-bold">Gaming Store</span>
          </Link>

          {/* Menú de Navegación */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 text-gray-300 rounded-md hover:text-white">
              Inicio
            </Link>
            <Link to="/products" className="px-3 py-2 text-gray-300 rounded-md hover:text-white">
              Productos
            </Link>

            {user ? (
              <>
                {user.role === 'ADMIN' || user.role === 'MANAGER' ? (
                  <Link to="/dashboard" className="px-3 py-2 text-gray-300 rounded-md hover:text-white">
                    Dashboard
                  </Link>
                ) : null}
                
                <Link to="/sales" className="px-3 py-2 text-gray-300 rounded-md hover:text-white">
                  {user.role === 'CUSTOMER' ? 'Mis Compras' : 'Ventas'}
                </Link>
                
                <div className="flex items-center space-x-2 text-gray-300">
                  <User className="w-5 h-5" />
                  <span>{user.name}</span>
                </div>
                
                {/* Icono del Carrito (solo para clientes) */}
                {user.role === 'CUSTOMER' && <CartIcon />}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 space-x-1 text-gray-300 rounded-md hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Salir</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-3 py-2 text-gray-300 rounded-md hover:text-white">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;