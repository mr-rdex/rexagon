# Rexagon Minecraft Server - PRD

## Original Problem Statement
Build a website for a Minecraft server (Rexagon) using React.js and MongoDB with FastAPI backend. Features include user registration/login, forum, leaderboard, profile pages, market with categories, admin panel, and community features. All in Turkish language.

## Tech Stack
- **Frontend:** React.js, TailwindCSS, Shadcn/UI components, Lucide icons
- **Backend:** FastAPI (Python), Motor (async MongoDB driver), JWT auth, bcrypt
- **Database:** MongoDB
- **Design:** Dark theme (#222222 bg, #FDD500 accent)
- **Avatars:** Cravatar.eu (https://cravatar.eu/helmavatar/{username}/{size})

## Core Features - Implemented
- [x] User registration/login (JWT-based)
- [x] Homepage with hero section (Minecraft bg), stats, leaderboards, news
- [x] Forum system (categories: Destek, Sikayet, Yardim, Reklam, Oneri, Duyurular, Genel)
- [x] Market with categories (VIP'ler, Spawnerlar, Ozel Esyalar, Paketler) + discounts
- [x] Leaderboard page (Siralama)
- [x] Profile pages (public, full-width banner, two-column layout, Cravatar.eu avatars)
- [x] Profile Themes system (admin-managed Minecraft bg themes, users unlock/select)
- [x] Admin Panel with 5 tabs (Users, Market, News, Reports, Themes)
- [x] Admin edit popups for Market items, News, and Themes
- [x] Help Center (footer popup for submitting reports)
- [x] Privacy Policy popup (footer)
- [x] Wallet page (Cuzdan)
- [x] Hakkimizda (About Us) page
- [x] Responsive mobile design
- [x] Click-activated profile dropdown in navbar
- [x] Server IP copy button (play.rexagon.com.tr)

## DB Collections
- `users`: id, kullanici_adi, email, sifre_hash, kredi, rol, yetki, yetki_gorseli, profil_arka_plani, acik_temalar[], aktif_tema_id, aktif_tema_gorsel, dogum_tarihi, kayit_tarihi
- `market_items`: id, isim, aciklama, fiyat, kategori, stok, gorsel, indirim
- `news`: id, baslik, icerik, yazar_id, tarih
- `forum_topics/replies`: standard forum schema
- `reports`: id, baslik, aciklama, konu, yazar_id, yazar_adi, tarih
- `themes`: id, isim, gorsel_url, fiyat, olusturulma_tarihi

## API Endpoints
- Auth: POST /api/auth/kayit, POST /api/auth/giris, GET /api/auth/me
- Users: GET /api/users/{username}
- Market: GET /api/market/urunler, GET /api/market/{kategori}/urunler, POST /api/market/satin-al/{id}
- Forum: GET/POST /api/forum/*, News: GET /api/haberler
- Themes: GET /api/themes, POST /api/themes/{id}/satin-al, PUT /api/themes/aktif/{id}
- Reports: POST /api/reports
- Admin: GET/PUT/DELETE /api/admin/kullanici, /api/admin/haber, /api/admin/market/urun, /api/admin/reports, /api/admin/themes

## Credentials
- **Admin:** rexagon_admin / Rexagon2026!
- **Default admin:** admin / admin123

## MOCKED Features
- Market purchase: sends placeholder minecraft command
- Active players stat: hardcoded 0

## Backlog / Future Tasks
- [ ] PayTR / Shopier payment integration
- [ ] Minecraft server command execution after purchase
- [ ] Live player stats from Minecraft server API
- [ ] Forum topic editing
- [ ] User biography editing on profile
