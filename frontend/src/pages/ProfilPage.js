import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';
import { User as UserIcon, Calendar, Coins, Mail, Shield, Lock, Check, Palette } from 'lucide-react';

const ProfilPage = () => {
  const { kullanici_adi } = useParams();
  const { API, user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [themes, setThemes] = useState([]);
  const [showThemes, setShowThemes] = useState(false);
  const [purchasing, setPurchasing] = useState(null);

  const isOwnProfile = !kullanici_adi || (currentUser && currentUser.kullanici_adi === kullanici_adi);

  useEffect(() => {
    fetchProfile();
    fetchThemes();
  }, [kullanici_adi, currentUser, API]);

  const fetchProfile = async () => {
    try {
      if (isOwnProfile && currentUser) {
        setProfileUser(currentUser);
      } else if (kullanici_adi) {
        const response = await axios.get(`${API}/users/${kullanici_adi}`);
        setProfileUser(response.data);
      }
    } catch (error) {
      console.error('Profil yüklenemedi:', error);
      setProfileUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchThemes = async () => {
    try {
      const response = await axios.get(`${API}/themes`);
      setThemes(response.data);
    } catch (error) {
      console.error('Temalar yüklenemedi:', error);
    }
  };

  const handlePurchaseTheme = async (themeId) => {
    setPurchasing(themeId);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/themes/${themeId}/satin-al`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.detail || 'Tema açılamadı');
    } finally {
      setPurchasing(null);
    }
  };

  const handleSetActiveTheme = async (themeId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/themes/aktif/${themeId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.detail || 'Tema aktifleştirilemedi');
    }
  };

  const handleRemoveTheme = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/themes/kaldir`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload();
    } catch (error) {
      alert('Tema kaldırılamadı');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center text-zinc-400">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center text-zinc-400">Kullanıcı bulunamadı</div>
        </div>
      </div>
    );
  }

  const userThemes = profileUser.acik_temalar || [];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" data-testid="profile-page">
      <div className="container mx-auto max-w-4xl">
        {/* Profile Header with Background */}
        <div
          className="relative rounded-lg overflow-hidden mb-8"
          style={{
            backgroundImage: profileUser.aktif_tema_gorsel
              ? `url(${profileUser.aktif_tema_gorsel})`
              : 'linear-gradient(135deg, #222222 0%, #1E1E1E 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '200px'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#222222]"></div>
          <div className="relative p-8">
            {isOwnProfile && (
              <button
                onClick={() => setShowThemes(!showThemes)}
                className="absolute top-4 right-4 bg-[#1E1E1E]/80 text-zinc-400 px-4 py-2 rounded-md text-sm hover:text-[#FDD500] transition-colors flex items-center space-x-2"
                data-testid="toggle-themes-button"
              >
                <Palette size={16} />
                <span>Temalar</span>
              </button>
            )}
          </div>
        </div>

        {/* Themes Section */}
        {showThemes && isOwnProfile && (
          <div className="bg-[#1E1E1E] border border-zinc-800 rounded-lg p-6 mb-8" data-testid="themes-section">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <Palette size={20} className="text-[#FDD500]" />
              <span>Profil Temaları</span>
            </h3>
            {profileUser.aktif_tema_id && (
              <button
                onClick={handleRemoveTheme}
                className="mb-4 text-sm text-zinc-400 hover:text-red-400 transition-colors underline"
                data-testid="remove-theme-button"
              >
                Mevcut temayı kaldır
              </button>
            )}
            {themes.length === 0 ? (
              <p className="text-zinc-500 text-sm">Henüz tema eklenmemiş.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {themes.map((theme) => {
                  const isUnlocked = userThemes.includes(theme.id);
                  const isActive = profileUser.aktif_tema_id === theme.id;
                  return (
                    <div
                      key={theme.id}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                        isActive ? 'border-[#FDD500] shadow-[0_0_20px_rgba(253,213,0,0.3)]' : 'border-zinc-700 hover:border-zinc-500'
                      }`}
                      data-testid={`theme-card-${theme.id}`}
                    >
                      <div
                        className="aspect-video bg-cover bg-center"
                        style={{ backgroundImage: `url(${theme.gorsel_url})` }}
                      />
                      <div className="p-3 bg-[#2A2A2A]">
                        <p className="text-white font-medium text-sm mb-1">{theme.isim}</p>
                        {isActive ? (
                          <span className="inline-flex items-center space-x-1 text-xs text-[#FDD500] font-bold">
                            <Check size={12} />
                            <span>Aktif</span>
                          </span>
                        ) : isUnlocked ? (
                          <button
                            onClick={() => handleSetActiveTheme(theme.id)}
                            className="text-xs bg-[#FDD500] text-black font-bold px-3 py-1 rounded hover:bg-[#E6C200] transition-colors"
                            data-testid={`activate-theme-${theme.id}`}
                          >
                            Kullan
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePurchaseTheme(theme.id)}
                            disabled={purchasing === theme.id}
                            className="text-xs bg-zinc-700 text-white font-bold px-3 py-1 rounded hover:bg-zinc-600 transition-colors flex items-center space-x-1 disabled:opacity-50"
                            data-testid={`buy-theme-${theme.id}`}
                          >
                            <Lock size={10} />
                            <span>{theme.fiyat > 0 ? `${theme.fiyat} Kredi` : 'Ücretsiz'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Profile Info */}
        <div className="bg-[#1E1E1E] border border-zinc-800 rounded-xl p-8" data-testid="profile-info">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8">
            {/* Avatar with Rank Badge */}
            <div className="relative">
              {profileUser.yetki_gorseli ? (
                <img
                  src={profileUser.yetki_gorseli}
                  alt={profileUser.yetki}
                  className="w-32 h-32 rounded-lg shadow-lg object-cover"
                />
              ) : (
                <img
                  src={`http://cravatar.eu/helmavatar/${profileUser.kullanici_adi}/128`}
                  alt={profileUser.kullanici_adi}
                  className="w-32 h-32 rounded-lg shadow-lg"
                />
              )}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#FDD500] to-[#E6C200] px-4 py-1 rounded-full shadow-lg">
                <span className="text-black font-bold text-xs uppercase">{profileUser.yetki || 'Oyuncu'}</span>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-center justify-center md:justify-start space-y-2 md:space-y-0 md:space-x-3 mb-2">
                <h1 className="text-4xl font-black uppercase text-white">
                  {profileUser.kullanici_adi}
                </h1>
                {profileUser.rol === 'admin' && (
                  <span className="inline-flex items-center space-x-1 bg-[#FDD500]/10 border border-[#FDD500]/30 px-3 py-1 rounded-full text-xs font-bold text-[#FDD500] uppercase">
                    <Shield size={14} />
                    <span>Admin</span>
                  </span>
                )}
              </div>
              <div className="flex flex-col md:flex-row items-center md:items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-zinc-400">
                <span className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>Kayıt: {formatDate(profileUser.kayit_tarihi)}</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Mail size={16} />
                  <span>{profileUser.email}</span>
                </span>
              </div>
              {/* Admin Panel Button */}
              {isOwnProfile && currentUser?.rol === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="mt-4 bg-[#FDD500] text-black font-bold uppercase tracking-wide px-6 py-2 rounded-lg hover:bg-[#E6C200] transition-all btn-3d flex items-center space-x-2 mx-auto md:mx-0"
                  data-testid="admin-panel-button"
                >
                  <Shield size={16} />
                  <span>Yönetim Paneli</span>
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#2A2A2A] rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Coins className="text-[#FDD500]" size={32} />
              </div>
              <p className="text-3xl font-black text-white mb-1">{(profileUser.kredi || 0).toFixed(0)}</p>
              <p className="text-sm text-zinc-400 uppercase tracking-wider">Kredi</p>
            </div>
            <div className="bg-[#2A2A2A] rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <UserIcon className="text-[#FDD500]" size={32} />
              </div>
              <p className="text-3xl font-black text-white mb-1 uppercase">{profileUser.yetki || 'Oyuncu'}</p>
              <p className="text-sm text-zinc-400 uppercase tracking-wider">Yetki</p>
            </div>
            <div className="bg-[#2A2A2A] rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Calendar className="text-[#FDD500]" size={32} />
              </div>
              <p className="text-lg font-bold text-white mb-1">
                {Math.floor((Date.now() - new Date(profileUser.kayit_tarihi)) / (1000 * 60 * 60 * 24))}
              </p>
              <p className="text-sm text-zinc-400 uppercase tracking-wider">Gün</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilPage;
