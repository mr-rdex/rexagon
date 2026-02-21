import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';
import { UserPlus, Mail, Lock, Calendar, CheckSquare } from 'lucide-react';

const KayitPage = () => {
  const { API, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    kullanici_adi: '',
    email: '',
    sifre: '',
    dogum_tarihi: '',
    gizlilik_sozlesmesi: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/kayit`, formData);
      login(response.data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Kayıt sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" data-testid="register-page">
      <div className="container mx-auto max-w-md">
        <div className="bg-[#1E1E1E] border border-zinc-800 rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FDD500]/10 rounded-full mb-4">
              <UserPlus className="text-[#FDD500]" size={32} />
            </div>
            <h1 className="text-4xl font-black uppercase text-white mb-2">Kayıt Ol</h1>
            <p className="text-zinc-400 text-sm">Kullanıcı adı oyunda ki ile aynı olmalıdır</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3 mb-6" data-testid="error-message">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2" htmlFor="kullanici_adi">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-600" size={20} />
                <input
                  id="kullanici_adi"
                  type="text"
                  required
                  minLength={3}
                  maxLength={20}
                  className="w-full bg-[#2A2A2A] border border-zinc-700 text-white rounded-md pl-10 pr-4 py-3 focus:outline-none focus:border-[#FDD500] focus:ring-1 focus:ring-[#FDD500] transition-all"
                  placeholder="Minecraft kullanıcı adınız"
                  value={formData.kullanici_adi}
                  onChange={(e) => setFormData({ ...formData, kullanici_adi: e.target.value })}
                  data-testid="username-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-600" size={20} />
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full bg-[#2A2A2A] border border-zinc-700 text-white rounded-md pl-10 pr-4 py-3 focus:outline-none focus:border-[#FDD500] focus:ring-1 focus:ring-[#FDD500] transition-all"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  data-testid="email-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2" htmlFor="sifre">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-600" size={20} />
                <input
                  id="sifre"
                  type="password"
                  required
                  minLength={6}
                  className="w-full bg-[#2A2A2A] border border-zinc-700 text-white rounded-md pl-10 pr-4 py-3 focus:outline-none focus:border-[#FDD500] focus:ring-1 focus:ring-[#FDD500] transition-all"
                  placeholder="••••••••"
                  value={formData.sifre}
                  onChange={(e) => setFormData({ ...formData, sifre: e.target.value })}
                  data-testid="password-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2" htmlFor="dogum_tarihi">
                Doğum Tarihi
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-600" size={20} />
                <input
                  id="dogum_tarihi"
                  type="date"
                  required
                  className="w-full bg-[#2A2A2A] border border-zinc-700 text-white rounded-md pl-10 pr-4 py-3 focus:outline-none focus:border-[#FDD500] focus:ring-1 focus:ring-[#FDD500] transition-all"
                  value={formData.dogum_tarihi}
                  onChange={(e) => setFormData({ ...formData, dogum_tarihi: e.target.value })}
                  data-testid="birthdate-input"
                />
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <input
                id="gizlilik_sozlesmesi"
                type="checkbox"
                required
                className="mt-1 w-4 h-4 rounded border-zinc-700 bg-[#2A2A2A] text-[#FDD500] focus:ring-[#FDD500]"
                checked={formData.gizlilik_sozlesmesi}
                onChange={(e) => setFormData({ ...formData, gizlilik_sozlesmesi: e.target.checked })}
                data-testid="privacy-checkbox"
              />
              <label htmlFor="gizlilik_sozlesmesi" className="text-sm text-zinc-400">
                Gizlilik sözleşmesini ve kullanım koşullarını kabul ediyorum
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FDD500] text-black font-bold uppercase tracking-wide px-8 py-4 rounded-sm hover:bg-[#E6C200] transition-all btn-3d disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="register-submit-button"
            >
              {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-400 text-sm">
              Zaten hesabınız var mı?{' '}
              <Link to="/giris" className="text-[#FDD500] hover:text-[#E6C200] font-medium">
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KayitPage;
