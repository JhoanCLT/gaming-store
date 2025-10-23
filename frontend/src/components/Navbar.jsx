import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ShoppingCart, 
  User, 
  LogOut, 
  Gamepad2, 
  Menu, 
  X,
  LayoutDashboard,
  Package,
  History
} from 'lucide-react';
import CartIcon from './CartIcon';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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

          {/* Menú Desktop */}
          <div className="items-center hidden space-x-4 md:flex">
            <Link to="/" className="px-3 py-2 text-gray-300 transition-colors rounded-md hover:text-white">
              Inicio
            </Link>
            <Link to="/products" className="px-3 py-2 text-gray-300 transition-colors rounded-md hover:text-white">
              Productos
            </Link>

            {user ? (
              <>
                {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
                  <Link to="/dashboard" className="flex items-center px-3 py-2 space-x-1 text-gray-300 transition-colors rounded-md hover:text-white">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                )}
                
                <Link to="/sales" className="flex items-center px-3 py-2 space-x-1 text-gray-300 transition-colors rounded-md hover:text-white">
                  <History className="w-4 h-4" />
                  <span>{user.role === 'CUSTOMER' ? 'Mis Compras' : 'Ventas'}</span>
                </Link>
                
                <div className="flex items-center space-x-2 text-gray-300">
                  <User className="w-5 h-5" />
                  <span className="truncate max-w-32">{user.name}</span>
                </div>
                
                {/* Icono del Carrito (solo para clientes) */}
                {user.role === 'CUSTOMER' && <CartIcon />}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 space-x-1 text-gray-300 transition-colors rounded-md hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Salir</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-3 py-2 text-gray-300 transition-colors rounded-md hover:text-white">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Botón Menú Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú Mobile */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-700 md:hidden bg-gaming-secondary">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="block px-3 py-2 text-gray-300 transition-colors rounded-md hover:text-white"
              >
                Inicio
              </Link>
              <Link
                to="/products"
                onClick={closeMobileMenu}
                className="block px-3 py-2 text-gray-300 transition-colors rounded-md hover:text-white"
              >
                Productos
              </Link>

              {user ? (
                <>
                  {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
                    <Link
                      to="/dashboard"
                      onClick={closeMobileMenu}
                      className="flex items-center block px-3 py-2 space-x-2 text-gray-300 transition-colors rounded-md hover:text-white"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                  )}
                  
                  <Link
                    to="/sales"
                    onClick={closeMobileMenu}
                    className="flex items-center block px-3 py-2 space-x-2 text-gray-300 transition-colors rounded-md hover:text-white"
                  >
                    <History className="w-4 h-4" />
                    <span>{user.role === 'CUSTOMER' ? 'Mis Compras' : 'Ventas'}</span>
                  </Link>

                  <div className="px-3 py-2 pt-2 mt-2 text-gray-300 border-t border-gray-700">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{user.name}</span>
                    </div>
                    <span className="text-xs text-gray-400 capitalize">({user.role.toLowerCase()})</span>
                  </div>

                  {user.role === 'CUSTOMER' && (
                    <div className="px-3 py-2">
                      <CartIcon />
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center block w-full px-3 py-2 space-x-2 text-left text-gray-300 transition-colors rounded-md hover:text-white"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 text-gray-300 transition-colors rounded-md hover:text-white"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 mx-3 text-gray-300 transition-colors rounded-md hover:text-white bg-gaming-primary hover:bg-indigo-700"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;