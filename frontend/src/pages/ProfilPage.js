import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';
import { User as UserIcon, Calendar, Coins, Mail, Shield } from 'lucide-react';

const ProfilPage = () => {
  const { kullanici_adi } = useParams();
  const { API, user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingBackground, setEditingBackground] = useState(false);
  const [newBackground, setNewBackground] = useState('');

  const isOwnProfile = !kullanici_adi || (currentUser && currentUser.kullanici_adi === kullanici_adi);

  useEffect(() => {
    fetchProfile();
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
      // Set error state if user not found
      setProfileUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBackground = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/users/profil?profil_arka_plani=${encodeURIComponent(newBackground)}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingBackground(false);
      window.location.reload();
    } catch (error) {
      console.error('Arka plan güncellenemedi:', error);
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

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" data-testid="profile-page">
      <div className="container mx-auto max-w-4xl">
        {/* Profile Header with Background */}
        <div
          className="relative rounded-lg overflow-hidden mb-8"
          style={{
            backgroundImage: profileUser.profil_arka_plani
              ? `url(${profileUser.profil_arka_plani})`
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
                onClick={() => setEditingBackground(true)}
                className="absolute top-4 right-4 bg-[#1E1E1E]/80 text-zinc-400 px-4 py-2 rounded-md text-sm hover:text-[#FDD500] transition-colors"
                data-testid="edit-background-button"
              >
                Arka Planı Düzenle
              </button>
            )}
          </div>
        </div>

        {editingBackground && (
          <div className="bg-[#1E1E1E] border border-zinc-800 rounded-lg p-6 mb-8" data-testid="edit-background-form">
            <h3 className="text-xl font-bold text-white mb-4">Profil Arka Planını Güncelle</h3>
            <form onSubmit={handleUpdateBackground} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Resim URL'si</label>
                <input
                  type="url"
                  required
                  className="w-full bg-[#2A2A2A] border border-zinc-700 text-white rounded-md px-4 py-3 focus:outline-none focus:border-[#FDD500] focus:ring-1 focus:ring-[#FDD500] transition-all"
                  placeholder="https://example.com/image.jpg"
                  value={newBackground}
                  onChange={(e) => setNewBackground(e.target.value)}
                  data-testid="background-url-input"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-[#FDD500] text-black font-bold uppercase tracking-wide px-6 py-3 rounded-sm hover:bg-[#E6C200] transition-all btn-3d"
                >
                  Kaydet
                </button>
                <button
                  type="button"
                  onClick={() => setEditingBackground(false)}
                  className="bg-transparent border-2 border-zinc-700 text-zinc-400 font-bold uppercase tracking-wide px-6 py-3 rounded-sm hover:border-zinc-600 transition-all"
                >
                  İptal
                </button>
              </div>
            </form>
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
                  src={`https://minotar.net/avatar/${profileUser.kullanici_adi}/128`}
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
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#2A2A2A] rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Coins className="text-[#FDD500]" size={32} />
              </div>
              <p className="text-3xl font-black text-white mb-1">{profileUser.kredi.toFixed(0)}</p>
              <p className="text-sm text-zinc-400 uppercase tracking-wider">Kredi</p>
            </div>
            <div className="bg-[#2A2A2A] rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <UserIcon className="text-[#FDD500]" size={32} />
              </div>
              <p className="text-3xl font-black text-white mb-1 uppercase">{profileUser.rol}</p>
              <p className="text-sm text-zinc-400 uppercase tracking-wider">Rol</p>
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
