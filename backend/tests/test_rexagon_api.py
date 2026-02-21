"""
Rexagon Minecraft Server API Tests
Tests for: auth, themes, reports, market, and admin endpoints
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://rexagon-staging.preview.emergentagent.com')

# Test credentials
ADMIN_USERNAME = "rexagon_admin"
ADMIN_PASSWORD = "Rexagon2026!"

class TestHealthAndBasic:
    """Basic health check tests"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Rexagon API"
        assert data["status"] == "online"
        print("PASS: API root endpoint working")
    
    def test_stats_endpoint(self):
        """Test server stats endpoint"""
        response = requests.get(f"{BASE_URL}/api/stats")
        assert response.status_code == 200
        data = response.json()
        assert "kayitli_oyuncu" in data
        assert "aktif_oyuncu" in data
        print(f"PASS: Stats endpoint working - {data['kayitli_oyuncu']} registered users")


class TestAuthentication:
    """Authentication endpoint tests"""
    
    def test_login_admin_success(self):
        """Test admin login with correct credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/giris", json={
            "kullanici_adi": ADMIN_USERNAME,
            "sifre": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        print("PASS: Admin login successful")
        return data["access_token"]
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/giris", json={
            "kullanici_adi": "invalid_user",
            "sifre": "wrong_password"
        })
        assert response.status_code == 401
        print("PASS: Invalid login rejected correctly")
    
    def test_get_current_user(self):
        """Test getting current user info after login"""
        # First login
        login_response = requests.post(f"{BASE_URL}/api/auth/giris", json={
            "kullanici_adi": ADMIN_USERNAME,
            "sifre": ADMIN_PASSWORD
        })
        assert login_response.status_code == 200
        token = login_response.json()["access_token"]
        
        # Get user info
        response = requests.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": f"Bearer {token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["kullanici_adi"] == ADMIN_USERNAME
        assert data["rol"] == "admin"
        assert "kredi" in data
        assert "email" in data
        print(f"PASS: Current user fetched - {data['kullanici_adi']} with role {data['rol']}")


class TestThemesAPI:
    """Tests for themes endpoints"""
    
    def test_get_all_themes(self):
        """GET /api/themes returns themes list"""
        response = requests.get(f"{BASE_URL}/api/themes")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"PASS: GET /api/themes returned {len(data)} themes")
        return data
    
    def test_admin_create_theme(self):
        """Admin can create a new theme"""
        # Login as admin
        login_response = requests.post(f"{BASE_URL}/api/auth/giris", json={
            "kullanici_adi": ADMIN_USERNAME,
            "sifre": ADMIN_PASSWORD
        })
        token = login_response.json()["access_token"]
        
        # Create theme
        theme_data = {
            "isim": f"TEST_Theme_{uuid.uuid4().hex[:6]}",
            "gorsel_url": "https://example.com/test-theme.jpg",
            "fiyat": 100.0
        }
        response = requests.post(f"{BASE_URL}/api/admin/themes", 
            json=theme_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["message"] == "Tema oluşturuldu"
        print(f"PASS: Theme created with id {data['id']}")
        return data["id"]


class TestReportsAPI:
    """Tests for reports endpoints"""
    
    def test_create_report_requires_auth(self):
        """POST /api/reports requires authentication"""
        response = requests.post(f"{BASE_URL}/api/reports", json={
            "baslik": "Test",
            "aciklama": "Test",
            "konu": "Genel"
        })
        assert response.status_code == 401
        print("PASS: Create report requires authentication")
    
    def test_create_report_authenticated(self):
        """POST /api/reports creates a report when authenticated"""
        # Login as admin
        login_response = requests.post(f"{BASE_URL}/api/auth/giris", json={
            "kullanici_adi": ADMIN_USERNAME,
            "sifre": ADMIN_PASSWORD
        })
        token = login_response.json()["access_token"]
        
        # Create report
        report_data = {
            "baslik": f"TEST_Report_{uuid.uuid4().hex[:6]}",
            "aciklama": "This is a test report",
            "konu": "Hata Bildirimi"
        }
        response = requests.post(f"{BASE_URL}/api/reports", 
            json=report_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["message"] == "Rapor gönderildi"
        print(f"PASS: Report created with id {data['id']}")
        return data["id"]
    
    def test_admin_get_reports(self):
        """GET /api/admin/reports returns reports (requires admin)"""
        # Login as admin
        login_response = requests.post(f"{BASE_URL}/api/auth/giris", json={
            "kullanici_adi": ADMIN_USERNAME,
            "sifre": ADMIN_PASSWORD
        })
        token = login_response.json()["access_token"]
        
        # Get reports
        response = requests.get(f"{BASE_URL}/api/admin/reports", headers={
            "Authorization": f"Bearer {token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"PASS: Admin got {len(data)} reports")
        return data


class TestMarketAPI:
    """Tests for market endpoints"""
    
    def test_get_all_market_items(self):
        """GET /api/market/urunler returns all market items"""
        response = requests.get(f"{BASE_URL}/api/market/urunler")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"PASS: GET /api/market/urunler returned {len(data)} items")
        return data
    
    def test_get_market_categories(self):
        """GET /api/market/kategoriler returns market categories"""
        response = requests.get(f"{BASE_URL}/api/market/kategoriler")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Check for Paketler category
        category_names = [cat.get("isim") for cat in data]
        assert "Paketler" in category_names, "Paketler category should exist"
        print(f"PASS: Market categories: {category_names}")
    
    def test_get_paketler_category_items(self):
        """GET /api/market/Paketler/urunler returns items in Paketler category"""
        response = requests.get(f"{BASE_URL}/api/market/Paketler/urunler")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Verify items belong to Paketler category
        for item in data:
            assert item.get("kategori") == "Paketler", f"Item {item.get('isim')} not in Paketler category"
        print(f"PASS: Paketler category has {len(data)} items")


class TestAdminAPI:
    """Tests for admin endpoints"""
    
    def test_admin_get_users(self):
        """Admin can get all users"""
        # Login as admin
        login_response = requests.post(f"{BASE_URL}/api/auth/giris", json={
            "kullanici_adi": ADMIN_USERNAME,
            "sifre": ADMIN_PASSWORD
        })
        token = login_response.json()["access_token"]
        
        # Get users
        response = requests.get(f"{BASE_URL}/api/admin/kullanicilar", headers={
            "Authorization": f"Bearer {token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"PASS: Admin got {len(data)} users")
    
    def test_non_admin_cannot_access(self):
        """Non-admin cannot access admin endpoints without auth"""
        response = requests.get(f"{BASE_URL}/api/admin/kullanicilar")
        assert response.status_code == 401
        print("PASS: Admin endpoint protected from unauthenticated access")


class TestLeaderboard:
    """Tests for leaderboard endpoints"""
    
    def test_get_top_credits(self):
        """GET /api/leaderboard/kredi returns top credit users"""
        response = requests.get(f"{BASE_URL}/api/leaderboard/kredi")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"PASS: Leaderboard top credits: {len(data)} entries")
    
    def test_get_latest_users(self):
        """GET /api/leaderboard/son-kayitlar returns latest registered users"""
        response = requests.get(f"{BASE_URL}/api/leaderboard/son-kayitlar")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"PASS: Latest users: {len(data)} entries")


class TestNews:
    """Tests for news endpoints"""
    
    def test_get_news(self):
        """GET /api/haberler returns news"""
        response = requests.get(f"{BASE_URL}/api/haberler")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"PASS: News: {len(data)} articles")


class TestForumAPI:
    """Tests for forum endpoints"""
    
    def test_get_forum_categories(self):
        """GET /api/forum/kategoriler returns forum categories"""
        response = requests.get(f"{BASE_URL}/api/forum/kategoriler")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"PASS: Forum categories: {len(data)} categories")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
