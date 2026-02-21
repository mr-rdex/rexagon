import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';
import { Calendar, Coins, Shield, Lock, Check, Palette, User as UserIcon } from 'lucide-react';

const ProfilPage = () => {
  const { kullanici_adi } = useParams();
  const { API, user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [themes, setThemes] = useState([]);
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
    return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
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
    <div className="min-h-screen pt-20" data-testid="profile-page">
      {/* Full-width Hero Banner */}
      <div
        className="relative w-full"
        style={{
          backgroundImage: profileUser.aktif_tema_gorsel
            ? `url(${profileUser.aktif_tema_gorsel})`
            : 'url(/images/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '180px'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-[#222222]"></div>
        <div className="relative container mx-auto max-w-7xl px-4 flex items-end pb-6" style={{ minHeight: '180px' }}>
          <div className="flex items-center space-x-5">
            <img
              src={profileUser.yetki_gorseli || `https://cravatar.eu/helmavatar/${profileUser.kullanici_adi}/80`}
              alt={profileUser.kullanici_adi}
              className="w-20 h-20 rounded-lg border-2 border-[#FDD500] shadow-lg"
              data-testid="profile-avatar"
            />
            <div>
              <h1 className="text-3xl font-black uppercase text-white leading-tight" data-testid="profile-username">
                {profileUser.kullanici_adi}
              </h1>
              <span className="inline-block mt-1 bg-[#FDD500] text-black text-xs font-bold uppercase px-3 py-1 rounded" data-testid="profile-rank">
                {profileUser.yetki || 'Oyuncu'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content: Two Column Layout */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Biyografi */}
            <div className="bg-[#1E1E1E] border border-zinc-800 rounded-lg p-6" data-testid="bio-section">
              <h3 className="text-zinc-500 text-sm uppercase tracking-wider mb-3">Biyografi</h3>
              <p className="text-zinc-300 text-sm">
                {profileUser.biyografi || 'Henüz bir biyografi eklenmemiş.'}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#1E1E1E] border border-zinc-800 rounded-lg p-5" data-testid="stat-credit">
                <div className="flex items-center space-x-3 mb-2">
                  <Coins className="text-[#FDD500]" size={20} />
                  <span className="text-zinc-500 text-sm uppercase tracking-wider">Kredi</span>
                </div>
                <p className="text-2xl font-black text-white">{(profileUser.kredi || 0).toFixed(0)}</p>
              </div>
              <div className="bg-[#1E1E1E] border border-zinc-800 rounded-lg p-5" data-testid="stat-role">
                <div className="flex items-center space-x-3 mb-2">
                  <Shield className="text-[#FDD500]" size={20} />
                  <span className="text-zinc-500 text-sm uppercase tracking-wider">Rol</span>
                </div>
                <p className="text-2xl font-black text-white uppercase">{profileUser.rol}</p>
              </div>
              <div className="bg-[#1E1E1E] border border-zinc-800 rounded-lg p-5" data-testid="stat-days">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="text-[#FDD500]" size={20} />
                  <span className="text-zinc-500 text-sm uppercase tracking-wider">Gün</span>
                </div>
                <p className="text-2xl font-black text-white">
                  {Math.floor((Date.now() - new Date(profileUser.kayit_tarihi)) / (1000 * 60 * 60 * 24))}
                </p>
              </div>
            </div>

            {/* Hesap Oluşturma Tarihi */}
            <div className="bg-[#1E1E1E] border border-zinc-800 rounded-lg p-6" data-testid="account-date-section">
              <h3 className="text-zinc-500 text-sm uppercase tracking-wider mb-3">Hesap Oluşturma Tarihi</h3>
              <p className="text-zinc-300 text-sm">{formatDate(profileUser.kayit_tarihi)}</p>
            </div>
          </div>

          {/* Right Column - Themes */}
          <div className="lg:col-span-1">
            <div className="bg-[#1E1E1E] border border-zinc-800 rounded-lg p-6" data-testid="themes-section">
              <h3 className="text-white font-bold uppercase tracking-wider text-center mb-6">Temalar</h3>
              {profileUser.aktif_tema_id && isOwnProfile && (
                <button
                  onClick={handleRemoveTheme}
                  className="w-full mb-4 text-sm text-zinc-400 hover:text-red-400 transition-colors text-center underline"
                  data-testid="remove-theme-button"
                >
                  Mevcut temayı kaldır
                </button>
              )}
              {themes.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center">Henüz tema eklenmemiş.</p>
              ) : (
                <div className="space-y-4">
                  {themes.map((theme) => {
                    const isUnlocked = userThemes.includes(theme.id);
                    const isActive = profileUser.aktif_tema_id === theme.id;
                    return (
                      <div
                        key={theme.id}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                          isActive ? 'border-[#FDD500]' : 'border-zinc-700'
                        }`}
                        data-testid={`theme-card-${theme.id}`}
                      >
                        <div
                          className="aspect-video bg-cover bg-center bg-[#2A2A2A]"
                          style={{ backgroundImage: `url(${theme.gorsel_url})` }}
                        />
                        {/* Status icon */}
                        <div className="absolute top-2 right-2">
                          {isActive ? (
                            <div className="w-7 h-7 bg-[#FDD500] rounded-full flex items-center justify-center">
                              <Check size={14} className="text-black" />
                            </div>
                          ) : isUnlocked ? (
                            <div className="w-7 h-7 bg-[#FDD500]/20 border border-[#FDD500] rounded-full flex items-center justify-center">
                              <Check size={14} className="text-[#FDD500]" />
                            </div>
                          ) : (
                            <div className="w-7 h-7 bg-zinc-800/80 border border-zinc-600 rounded-full flex items-center justify-center">
                              <Lock size={12} className="text-zinc-400" />
                            </div>
                          )}
                        </div>
                        <div className="p-3 bg-[#2A2A2A]">
                          <p className="text-white font-medium text-sm">{theme.isim}</p>
                          {isOwnProfile && (
                            <div className="mt-2">
                              {isActive ? (
                                <span className="text-xs text-[#FDD500] font-bold">Aktif</span>
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
                                  className="text-xs bg-zinc-700 text-white font-bold px-3 py-1 rounded hover:bg-zinc-600 transition-colors disabled:opacity-50"
                                  data-testid={`buy-theme-${theme.id}`}
                                >
                                  {theme.fiyat > 0 ? `${theme.fiyat} Kredi` : 'Ücretsiz Aç'}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilPage;
