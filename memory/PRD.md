# Rexagon Minecraft Server - PRD

## Original Problem Statement
Build a website for a Minecraft server (Rexagon) using React.js and MongoDB with FastAPI backend. Features include user registration/login, forum, leaderboard, profile pages, market with categories, admin panel, and community features. All in Turkish language.

## Tech Stack
- **Frontend:** React.js, TailwindCSS, Shadcn/UI components, Lucide icons
- **Backend:** FastAPI (Python), Motor (async MongoDB driver), JWT auth, bcrypt
- **Database:** MongoDB
- **Design:** Dark theme (#222222 bg, #FDD500 accent)

## Core Features - Implemented
- [x] User registration/login (JWT-based)
- [x] Homepage with hero section (Minecraft bg), stats, leaderboards, news
- [x] Forum system (categories: Destek, Şikayet, Yardım, Reklam, Öneri, Duyurular, Genel)
- [x] Market with categories (VIP'ler, Spawnerlar, Özel Eşyalar, Paketler) + discounts
- [x] Leaderboard page (Sıralama)
- [x] Profile pages (public, with Minotar avatars)
- [x] Profile Themes system (admin-managed Minecraft bg themes, users unlock/select)
- [x] Admin Panel (Users, Market, News, Reports, Themes management)
- [x] Help Center (footer popup for submitting reports)
- [x] Privacy Policy popup (footer)
- [x] Wallet page (Cüzdan)
- [x] Hakkımızda (About Us) page
- [x] Responsive mobile design
- [x] Click-activated profile dropdown in navbar
- [x] Server IP copy button (play.rexagon.com.tr)
- [x] Admin "Yönetim Paneli" button on profile page

## DB Collections
- `users`: id, kullanici_adi, email, sifre_hash, kredi, rol, yetki, yetki_gorseli, profil_arka_plani, acik_temalar[], aktif_tema_id, aktif_tema_gorsel, dogum_tarihi, kayit_tarihi
- `market_items`: id, isim, aciklama, fiyat, kategori, stok, gorsel, indirim
- `news`: id, baslik, icerik, yazar_id, tarih
- `forum_topics`: id, baslik, icerik, kategori, yazar_id, tarih
- `forum_replies`: id, konu_id, icerik, yazar_id, tarih
- `forum_categories`: id, isim, aciklama
- `market_categories`: id, isim, aciklama
- `purchases`: id, kullanici_id, urun_id, urun_adi, toplam_fiyat, tarih
- `credit_transactions`: id, kullanici_id, tutar, tip, durum, tarih
- `reports`: id, baslik, aciklama, konu, yazar_id, yazar_adi, tarih
- `themes`: id, isim, gorsel_url, fiyat, olusturulma_tarihi

## Credentials
- **Admin:** rexagon_admin / Rexagon2026!
- **Default admin:** admin / admin123

## MOCKED Features
- Market purchase: sends placeholder minecraft command (real server API pending)
- Active players stat: hardcoded 0 (real Minecraft server API pending)

## Backlog / Future Tasks
- [ ] PayTR / Shopier payment integration for wallet top-up
- [ ] Minecraft server command execution after purchase
- [ ] Live player stats from Minecraft server API
- [ ] Forum topic editing
- [ ] Advanced admin user editing (inline forms instead of prompts)

## File Structure
```
/app/backend/server.py - All FastAPI routes and models
/app/frontend/src/App.js - Main router
/app/frontend/src/pages/ - All page components
/app/frontend/src/components/ - Navigation, Footer, UI components
```
