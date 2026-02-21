import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Menu, X, User, LogOut, Shield } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Ana Sayfa' },
    { to: '/market', label: 'Market' },
    { to: '/forum', label: 'Forum' },
    { to: '/siralama', label: 'Sıralama' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#222222]/95 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" data-testid="logo-link">
            <div className="w-10 h-10 bg-[#FDD500] flex items-center justify-center font-black text-black text-xl">
              R
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase">Rexagon</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-zinc-400 hover:text-[#FDD500] font-medium transition-colors uppercase tracking-wider text-sm"
                data-testid={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3 px-4 py-2 bg-[#1E1E1E] border border-zinc-800 rounded-md">
                  <img
                    src={`https://minotar.net/avatar/${user.kullanici_adi}/32`}
                    alt={user.kullanici_adi}
                    className="w-8 h-8 rounded"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{user.kullanici_adi}</span>
                    <span className="text-xs text-[#FDD500] font-bold">{user.kredi.toFixed(0)} ₺</span>
                  </div>
                </div>
                <Link
                  to="/profil"
                  className="p-2 text-zinc-400 hover:text-[#FDD500] transition-colors"
                  data-testid="profile-button"
                >
                  <User size={20} />
                </Link>
                {user.rol === 'admin' && (
                  <Link
                    to="/admin"
                    className="p-2 text-zinc-400 hover:text-[#FDD500] transition-colors"
                    data-testid="admin-button"
                  >
                    <Shield size={20} />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                  data-testid="logout-button"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/giris"
                  className="text-zinc-400 hover:text-white font-medium transition-colors uppercase tracking-wider text-sm"
                  data-testid="login-link"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/kayit"
                  className="bg-[#FDD500] text-black font-bold uppercase tracking-wide px-6 py-2 rounded-sm hover:bg-[#E6C200] transition-all btn-3d"
                  data-testid="register-link"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/5">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-3 text-zinc-400 hover:text-[#FDD500] font-medium transition-colors uppercase tracking-wider text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/5 mt-4 pt-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src={`https://minotar.net/avatar/${user.kullanici_adi}/32`}
                      alt={user.kullanici_adi}
                      className="w-8 h-8 rounded"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{user.kullanici_adi}</span>
                      <span className="text-xs text-[#FDD500] font-bold">{user.kredi.toFixed(0)} ₺</span>
                    </div>
                  </div>
                  <Link
                    to="/profil"
                    className="block py-2 text-zinc-400 hover:text-[#FDD500]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profil
                  </Link>
                  {user.rol === 'admin' && (
                    <Link
                      to="/admin"
                      className="block py-2 text-zinc-400 hover:text-[#FDD500]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-zinc-400 hover:text-red-500"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/giris"
                    className="block py-2 text-zinc-400 hover:text-[#FDD500]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    to="/kayit"
                    className="block py-2 text-[#FDD500] hover:text-[#E6C200] font-bold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Kayıt Ol
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

export default Navigation;
