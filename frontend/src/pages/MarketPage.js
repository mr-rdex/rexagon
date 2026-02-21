import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';
import { Package, Coins, ShoppingCart, Filter } from 'lucide-react';

const MarketPage = () => {
  const { kategori } = useParams();
  const { API, user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(kategori || null);
  const [purchasing, setPurchasing] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [API]);

  useEffect(() => {
    fetchItems();
  }, [selectedCategory, API]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/market/kategoriler`);
      setCategories(response.data);
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  const fetchItems = async () => {
    try {
      let url;
      if (selectedCategory === 'En Çok Satanlar') {
        url = `${API}/market/en-cok-satanlar`;
      } else if (selectedCategory && selectedCategory !== 'Tümü') {
        url = `${API}/market/${selectedCategory}/urunler`;
      } else {
        url = `${API}/market/Tümü/urunler`;
      }
      const response = await axios.get(url);
      setItems(response.data);
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (itemId, itemPrice) => {
    if (!user) {
      navigate('/giris');
      return;
    }

    if (user.kredi < itemPrice) {
      alert('Yetersiz kredi!');
      return;
    }

    setPurchasing(itemId);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API}/market/satin-al/${itemId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Satın alma başarılı! Minecraft komutu: ${response.data.minecraft_command}`);
      setShowConfirmModal(false);
      setSelectedItem(null);
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.detail || 'Satın alma başarısız');
    } finally {
      setPurchasing(null);
    }
  };

  const openConfirmModal = (item) => {
    setSelectedItem(item);
    setShowConfirmModal(true);
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

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" data-testid="market-page">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-white mb-4">
            Market
          </h1>
          <p className="text-lg text-zinc-400">
            Kredilerinle harika öğeler satın al ve oyun deneyimini geliştir
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-4 mb-8 overflow-x-auto pb-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-3 rounded-sm font-bold uppercase tracking-wide transition-all whitespace-nowrap ${
              !selectedCategory
                ? 'bg-[#FDD500] text-black btn-3d'
                : 'bg-[#1E1E1E] border border-zinc-800 text-zinc-400 hover:border-[#FDD500]/50'
            }`}
            data-testid="category-all"
          >
            Tümü
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.isim)}
              className={`px-6 py-3 rounded-sm font-bold uppercase tracking-wide transition-all whitespace-nowrap ${
                selectedCategory === cat.isim
                  ? 'bg-[#FDD500] text-black btn-3d'
                  : 'bg-[#1E1E1E] border border-zinc-800 text-zinc-400 hover:border-[#FDD500]/50'
              }`}
              data-testid={`category-${cat.isim}`}
            >
              {cat.isim}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-[#1E1E1E] border border-zinc-800 rounded-lg overflow-hidden hover:border-[#FDD500]/50 transition-colors group"
                data-testid="market-item-card"
              >
                {item.gorsel && (
                  <div className="aspect-video bg-[#2A2A2A] overflow-hidden">
                    <img
                      src={item.gorsel}
                      alt={item.isim}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#FDD500] transition-colors">
                      {item.isim}
                    </h3>
                    <span className="text-xs bg-[#2A2A2A] px-2 py-1 rounded text-zinc-400">
                      {item.kategori}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{item.aciklama}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-[#FDD500]">{item.fiyat} ₺</span>
                    </div>
                    <span className="text-xs text-zinc-500">Stok: {item.stok}</span>
                  </div>
                  <button
                    onClick={() => handlePurchase(item.id, item.fiyat)}
                    disabled={item.stok <= 0 || purchasing === item.id}
                    className="w-full bg-[#FDD500] text-black font-bold uppercase tracking-wide px-6 py-3 rounded-sm hover:bg-[#E6C200] transition-all btn-3d disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    data-testid="purchase-button"
                  >
                    <ShoppingCart size={20} />
                    <span>
                      {purchasing === item.id
                        ? 'Satın alınıyor...'
                        : item.stok <= 0
                        ? 'Stokta Yok'
                        : 'Satın Al'}
                    </span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <Package className="mx-auto text-zinc-600 mb-4" size={48} />
              <p className="text-zinc-400">Bu kategoride ürün bulunamadı</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketPage;
