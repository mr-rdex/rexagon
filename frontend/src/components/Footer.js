import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] border-t border-zinc-800 mt-20">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <img 
              src="/images/footer-logo.png" 
              alt="Rexagon" 
              className="h-24 w-auto object-contain mb-4"
            />
            <p className="text-zinc-400 text-sm">
              Türkiye'nin en büyük Minecraft sunucu topluluğu. Heyecan dolu maceralar seni bekliyor!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-4 text-sm">Hızlı Erişim</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-zinc-400 hover:text-[#FDD500] transition-colors text-sm">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link to="/market" className="text-zinc-400 hover:text-[#FDD500] transition-colors text-sm">
                  Market
                </Link>
              </li>
              <li>
                <Link to="/forum" className="text-zinc-400 hover:text-[#FDD500] transition-colors text-sm">
                  Forum
                </Link>
              </li>
              <li>
                <Link to="/siralama" className="text-zinc-400 hover:text-[#FDD500] transition-colors text-sm">
                  Sıralama
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-4 text-sm">Destek</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/forum/Destek" className="text-zinc-400 hover:text-[#FDD500] transition-colors text-sm">
                  Yardım Merkezi
                </Link>
              </li>
              <li>
                <Link to="/forum/Duyurular" className="text-zinc-400 hover:text-[#FDD500] transition-colors text-sm">
                  Duyurular
                </Link>
              </li>
              <li>
                <a href="mailto:destek@rexagon.com.tr" className="text-zinc-400 hover:text-[#FDD500] transition-colors text-sm">
                  İletişim
                </a>
              </li>
              <li>
                <button className="text-zinc-400 hover:text-[#FDD500] transition-colors text-sm">
                  Gizlilik Politikası
                </button>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-4 text-sm">Sosyal Medya</h3>
            <div className="flex space-x-4 mb-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-[#2A2A2A] rounded-lg flex items-center justify-center text-zinc-400 hover:text-[#FDD500] hover:bg-[#FDD500]/10 transition-all duration-300"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-[#2A2A2A] rounded-lg flex items-center justify-center text-zinc-400 hover:text-[#FDD500] hover:bg-[#FDD500]/10 transition-all duration-300"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-[#2A2A2A] rounded-lg flex items-center justify-center text-zinc-400 hover:text-[#FDD500] hover:bg-[#FDD500]/10 transition-all duration-300"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-[#2A2A2A] rounded-lg flex items-center justify-center text-zinc-400 hover:text-[#FDD500] hover:bg-[#FDD500]/10 transition-all duration-300"
              >
                <Youtube size={20} />
              </a>
            </div>
            <div className="flex items-center space-x-2 text-zinc-400 text-sm">
              <Mail size={16} />
              <a href="mailto:info@rexagon.com.tr" className="hover:text-[#FDD500] transition-colors">
                info@rexagon.com.tr
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-zinc-500 text-sm mb-4 md:mb-0">
            © 2026 Rexagon Minecraft Server. Tüm hakları saklıdır.
          </p>
          <p className="text-zinc-500 text-xs">
            Made with <span className="text-[#FDD500]">❤</span> by Rexagon Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
