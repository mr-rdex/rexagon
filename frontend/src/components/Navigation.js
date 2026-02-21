import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Menu, X, User, LogOut, Shield, Wallet, Settings, Copy, Check } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
    setShowProfileMenu(false);
  };

  const handleCopyIP = () => {
    navigator.clipboard.writeText('play.rexagon.com.tr');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navLinks = [
    { to: '/', label: 'Ana Sayfa' },
    { to: '/market', label: 'Market' },
    { to: '/forum', label: 'Forum' },
    { to: '/siralama', label: 'Sıralama' },
    { to: '/hakkimizda', label: 'Hakkımızda' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#222222]/95 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center" data-testid="logo-link">
            <img 
              src="/images/logo.png" 
              alt="Rexagon" 
              className="h-12 md:h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-zinc-400 hover:text-[#FDD500] font-medium transition-colors uppercase tracking-wider text-sm whitespace-nowrap"
                data-testid={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 px-4 py-2 bg-[#1E1E1E] border border-zinc-800 rounded-xl hover:border-[#FDD500]/50 transition-all"
                  data-testid="profile-menu-button"
                >
                  <img
                    src={`https://minotar.net/avatar/${user.kullanici_adi}/32`}
                    alt={user.kullanici_adi}
                    className="w-8 h-8 rounded"
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-white">{user.kullanici_adi}</span>
                    <span className="text-xs text-[#FDD500] font-bold">{user.kredi.toFixed(0)} ₺</span>
                  </div>
                </button>

                {showProfileMenu && (
                  <div
                    className="absolute right-0 top-full mt-2 w-56 bg-[#1E1E1E] border border-zinc-800 rounded-xl shadow-lg overflow-hidden transition-all duration-200"
                    data-testid="profile-dropdown"
                  >
                    <Link
                      to="/profil"
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-[#2A2A2A] transition-colors text-white"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User size={18} />
                      <span>Profil</span>
                    </Link>
                    <Link
                      to="/profil"
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-[#2A2A2A] transition-colors text-white"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings size={18} />
                      <span>Profil Ayarları</span>
                    </Link>
                    <Link
                      to="/cuzdan"
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-[#2A2A2A] transition-colors text-white"
                      onClick={() => setShowProfileMenu(false)}
                      data-testid="wallet-link"
                    >
                      <Wallet size={18} />
                      <div className="flex flex-col">
                        <span>Cüzdan</span>
                        <span className="text-xs text-[#FDD500]">{user.kredi.toFixed(0)} ₺</span>
                      </div>
                    </Link>
                    {user.rol === 'admin' && (
                      <>
                        <div className="border-t border-zinc-800"></div>
                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-[#2A2A2A] transition-colors text-[#FDD500]"
                          onClick={() => setShowProfileMenu(false)}
                          data-testid="admin-link"
                        >
                          <Shield size={18} />
                          <span>Yönetim</span>
                        </Link>
                      </>
                    )}
                    <div className="border-t border-zinc-800"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-[#2A2A2A] transition-colors text-red-400"
                      data-testid="logout-button"
                    >
                      <LogOut size={18} />
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                )}
              </div>
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
                  className="bg-[#FDD500] text-black font-bold uppercase tracking-wide px-6 py-2 rounded-lg hover:bg-[#E6C200] transition-all btn-3d"
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
                  <Link
                    to="/cuzdan"
                    className="block py-2 text-zinc-400 hover:text-[#FDD500]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cüzdan
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
