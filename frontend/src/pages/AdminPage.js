import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../App';
import { Users, MessageSquare, Package, Newspaper, Trash2, Edit, Plus } from 'lucide-react';

const AdminPage = () => {
  const { API } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [marketItems, setMarketItems] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // New item/news forms
  const [showNewItem, setShowNewItem] = useState(false);
  const [showNewNews, setShowNewNews] = useState(false);
  const [newItem, setNewItem] = useState({
    isim: '',
    aciklama: '',
    fiyat: 0,
    kategori: "VIP'ler",
    stok: 100,
    gorsel: '',
    indirim: 0
  });
  const [newNews, setNewNews] = useState({ baslik: '', icerik: '' });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'market') fetchMarketItems();
    if (activeTab === 'news') fetchNews();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/admin/kullanicilar`, { headers });
      setUsers(response.data);
    } catch (error) {
      console.error('Kullanıcılar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/market/urunler`);
      setMarketItems(response.data);
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/haberler?limit=50`);
      setNews(response.data);
    } catch (error) {
      console.error('Haberler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId, field, value) => {
    try {
      const params = new URLSearchParams();
      params.append(field, value);
      await axios.put(`${API}/admin/kullanici/${userId}?${params.toString()}`, {}, { headers });
      alert('Kullanıcı güncellendi');
      fetchUsers();
    } catch (error) {
      alert('Güncelleme başarısız');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
    try {
      await axios.delete(`${API}/admin/kullanici/${userId}`, { headers });
      alert('Kullanıcı silindi');
      fetchUsers();
    } catch (error) {
      alert('Silme başarısız');
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/admin/market/urun`, newItem, { headers });
      alert('Ürün oluşturuldu');
      setShowNewItem(false);
      setNewItem({ isim: '', aciklama: '', fiyat: 0, kategori: "VIP'ler", stok: 100, gorsel: '', indirim: 0 });
      fetchMarketItems();
    } catch (error) {
      alert('Ürün oluşturulamadı');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    try {
      await axios.delete(`${API}/admin/market/urun/${itemId}`, { headers });
      alert('Ürün silindi');
      fetchMarketItems();
    } catch (error) {
      alert('Silme başarısız');
    }
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/admin/haber`, newNews, { headers });
      alert('Haber oluşturuldu');
      setShowNewNews(false);
      setNewNews({ baslik: '', icerik: '' });
      fetchNews();
    } catch (error) {
      alert('Haber oluşturulamadı');
    }
  };

  const handleDeleteNews = async (newsId) => {
    if (!window.confirm('Bu haberi silmek istediğinize emin misiniz?')) return;
    try {
      await axios.delete(`${API}/admin/haber/${newsId}`, { headers });
      alert('Haber silindi');
      fetchNews();
    } catch (error) {
      alert('Silme başarısız');
    }
  };

  const tabs = [
    { id: 'users', label: 'Kullanıcı Yönetimi', icon: Users },
    { id: 'market', label: 'Market Yönetimi', icon: Package },
    { id: 'news', label: 'Haber Yönetimi', icon: Newspaper }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" data-testid="admin-page">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-white mb-4">
            Admin Panel
          </h1>
          <p className="text-lg text-zinc-400">
            Sistemi yönet ve içerikleri düzenle
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-sm font-bold uppercase tracking-wide transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#FDD500] text-black btn-3d'
                    : 'bg-[#1E1E1E] border border-zinc-800 text-zinc-400 hover:border-[#FDD500]/50'
                }`}
                data-testid={`admin-tab-${tab.id}`}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-zinc-400">Yükleniyor...</div>
        ) : (
          <>
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-[#1E1E1E] border border-zinc-800 rounded-lg overflow-hidden" data-testid="users-section">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left p-4 text-zinc-400 text-sm uppercase tracking-wider">Kullanıcı</th>
                        <th className="text-left p-4 text-zinc-400 text-sm uppercase tracking-wider">Email</th>
                        <th className="text-left p-4 text-zinc-400 text-sm uppercase tracking-wider">Kredi</th>
                        <th className="text-left p-4 text-zinc-400 text-sm uppercase tracking-wider">Yetki</th>
                        <th className="text-left p-4 text-zinc-400 text-sm uppercase tracking-wider">Rol</th>
                        <th className="text-right p-4 text-zinc-400 text-sm uppercase tracking-wider">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-zinc-800 hover:bg-[#2A2A2A] transition-colors">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={`https://minotar.net/avatar/${user.kullanici_adi}/32`}
                                alt={user.kullanici_adi}
                                className="w-8 h-8 rounded"
                              />
                              <span className="text-white font-medium">{user.kullanici_adi}</span>
                            </div>
                          </td>
                          <td className="p-4 text-zinc-400">{user.email}</td>
                          <td className="p-4">
                            <span className="text-[#FDD500] font-bold">{user.kredi.toFixed(0)} ₺</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              user.rol === 'admin' ? 'bg-[#FDD500]/10 text-[#FDD500]' : 'bg-zinc-800 text-zinc-400'
                            }`}>
                              {user.rol}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                const newKredi = prompt('Yeni kredi miktarı:', user.kredi);
                                if (newKredi !== null) handleUpdateUser(user.id, parseFloat(newKredi));
                              }}
                              className="text-[#FDD500] hover:text-[#E6C200] mr-3"
                              data-testid={`edit-user-${user.kullanici_adi}`}
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-500 hover:text-red-400"
                              data-testid={`delete-user-${user.kullanici_adi}`}
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Market Tab */}
            {activeTab === 'market' && (
              <div data-testid="market-section">
                <div className="mb-6">
                  <button
                    onClick={() => setShowNewItem(!showNewItem)}
                    className="bg-[#FDD500] text-black font-bold uppercase tracking-wide px-6 py-3 rounded-sm hover:bg-[#E6C200] transition-all btn-3d flex items-center space-x-2"
                    data-testid="new-item-button"
                  >
                    <Plus size={20} />
                    <span>Yeni Ürün Ekle</span>
                  </button>
                </div>

                {showNewItem && (
                  <div className="bg-[#1E1E1E] border border-zinc-800 rounded-lg p-6 mb-6" data-testid="new-item-form">
                    <h3 className="text-xl font-bold text-white mb-4">Yeni Ürün Ekle</h3>
                    <form onSubmit={handleCreateItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Ürün Adı</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-[#2A2A2A] border border-zinc-700 text-white rounded-md px-4 py-3 focus:outline-none focus:border-[#FDD500] focus:ring-1 focus:ring-[#FDD500] transition-all"
                          value={newItem.isim}
                          onChange={(e) => setNewItem({ ...newItem, isim: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Fiyat</label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          className="w-full bg-[#2A2A2A] border border-zinc-700 text-white rounded-md px-4 py-3 focus:outline-none focus:border-[#FDD500] focus:ring-1 focus:ring-[#FDD500] transition-all"
                          value={newItem.fiyat}
                          onChange={(e) => setNewItem({ ...newItem, fiyat: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Kategori</label>
                        <select
                          className="w-full bg-[#2A2A2A] border border-zinc-700 text-white rounded-md px-4 py-3 focus:outline-none focus:border-[#FDD500] focus:ring-1 focus:ring-[#FDD500] transition-all"
                          value={newItem.kategori}
                          onChange={(e) => setNewItem({ ...newItem, kategori: e.target.value })}
                        >
                          <option value="VIP'ler">VIP'ler</option>
                          <option value="Spawnerlar">Spawnerlar</option>
                          <option value="Özel Eşyalar">Özel Eşyalar</option>
                          <option value="Paketler">Paketler</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Stok</label>
                        <input
                          type="number"
                          required
                          min="0"
                          className="w-full bg-[#2A2A2A] border border-zinc-700 text-white rounded-md px-4 py-3 focus:outline-none focus:border-[#FDD500] focus:ring-1 focus:ring-[#FDD500] transition-all"
                          value={newItem.stok}
                          onChange={(e) => setNewItem({ ...newItem, stok: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">İndirim (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-full bg-[#2A2A2A] border border-zinc-700 text-white rounded-md px-4 py-3 focus:outline-none focus:border-[#FDD500] focus:ring-1 focus:ring-[#FDD500] transition-all"
                          value={newItem.indirim}
                          onChange={(e) => setNewItem({ ...newItem, indirim: parseInt(e.target.value) || 0 })}
                          placeholder="0"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Açıklama</label>
                        <textarea
                          required
                          rows={3}
                          className="w-full bg-[#2A2A2A] border border-zinc-700 text-white rounded-md px-4 py-3 focus:outline-none focus:border-[#FDD500] focus:ring-1 focus:ring-[#FDD500] transition-all"
                          value={newItem.aciklama}
                          onChange={(e) => setNewItem({ ...newItem, aciklama: e.target.value })}
                        ></textarea>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Görsel URL (Opsiyonel)</label>
                        <input
                          type="url"
                          className="w-full bg-[#2A2A2A] border border-zinc-700 text-white rounded-md px-4 py-3 focus:outline-none focus:border-[#FDD500] focus:ring-1 focus:ring-[#FDD500] transition-all"
                          value={newItem.gorsel}
                          onChange={(e) => setNewItem({ ...newItem, gorsel: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2 flex space-x-4">
                        <button
                          type="submit"
                          className="bg-[#FDD500] text-black font-bold uppercase tracking-wide px-6 py-3 rounded-sm hover:bg-[#E6C200] transition-all btn-3d"
                        >
                          Oluştur
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewItem(false)}
                          className="bg-transparent border-2 border-zinc-700 text-zinc-400 font-bold uppercase tracking-wide px-6 py-3 rounded-sm hover:border-zinc-600 transition-all"
                        >
                          İptal
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {marketItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#1E1E1E] border border-zinc-800 rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">{item.isim}</h3>
                          <p className="text-xs text-zinc-500">{item.kategori}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-500 hover:text-red-400"
                          data-testid={`delete-item-${item.id}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-sm text-zinc-400 mb-3 line-clamp-2">{item.aciklama}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          {item.indirim > 0 && (
                            <>
                              <span className="text-xs text-red-500 font-bold">%{item.indirim} İNDİRİM</span>
                              <span className="text-sm text-zinc-500 line-through">{item.fiyat} ₺</span>
                            </>
                          )}
                          <span className="text-[#FDD500] font-bold">
                            {(item.indirim > 0 ? item.fiyat * (1 - item.indirim / 100) : item.fiyat).toFixed(2)} ₺
                          </span>
                        </div>
                        <span className="text-xs text-zinc-500">Stok: {item.stok}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* News Tab */}
            {activeTab === 'news' && (
              <div data-testid="news-section">
                <div className="mb-6">
                  <button
                    onClick={() => setShowNewNews(!showNewNews)}
                    className="bg-[#FDD500] text-black font-bold uppercase tracking-wide px-6 py-3 rounded-sm hover:bg-[#E6C200] transition-all btn-3d flex items-center space-x-2"
                    data-testid="new-news-button"
                  >
                    <Plus size={20} />
                    <span>Yeni Haber Ekle</span>
                  </button>
                </div>

                {showNewNews && (
                  <div className="bg-[#1E1E1E] border border-zinc-800 rounded-lg p-6 mb-6" data-testid="new-news-form">
                    <h3 className="text-xl font-bold text-white mb-4">Yeni Haber Ekle</h3>
                    <form onSubmit={handleCreateNews} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Başlık</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-[#2A2A2A] border border-zinc-700 text-white rounded-md px-4 py-3 focus:outline-none focus:border-[#FDD500] focus:ring-1 focus:ring-[#FDD500] transition-all"
                          value={newNews.baslik}
                          onChange={(e) => setNewNews({ ...newNews, baslik: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">İçerik</label>
                        <textarea
                          required
                          rows={6}
                          className="w-full bg-[#2A2A2A] border border-zinc-700 text-white rounded-md px-4 py-3 focus:outline-none focus:border-[#FDD500] focus:ring-1 focus:ring-[#FDD500] transition-all"
                          value={newNews.icerik}
                          onChange={(e) => setNewNews({ ...newNews, icerik: e.target.value })}
                        ></textarea>
                      </div>
                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          className="bg-[#FDD500] text-black font-bold uppercase tracking-wide px-6 py-3 rounded-sm hover:bg-[#E6C200] transition-all btn-3d"
                        >
                          Oluştur
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewNews(false)}
                          className="bg-transparent border-2 border-zinc-700 text-zinc-400 font-bold uppercase tracking-wide px-6 py-3 rounded-sm hover:border-zinc-600 transition-all"
                        >
                          İptal
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="space-y-4">
                  {news.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#1E1E1E] border border-zinc-800 rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{item.baslik}</h3>
                          <p className="text-zinc-400 mb-3 line-clamp-2">{item.icerik}</p>
                          <div className="flex items-center space-x-4 text-xs text-zinc-500">
                            <span>Yazar: {item.yazar_adi}</span>
                            <span>Tarih: {new Date(item.tarih).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteNews(item.id)}
                          className="text-red-500 hover:text-red-400 ml-4"
                          data-testid={`delete-news-${item.id}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
