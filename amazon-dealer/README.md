# Amazon Dealer - AI Sosyal Medya Entegrasyon Platformu

Amazon satıcıları için AI tabanlı sosyal medya entegrasyon yazılımı. Bu platform, Amazon ürünlerinizi otomatik olarak sosyal medyada tanıtmanıza yardımcı olur.

## 🚀 Özellikler

- **Amazon SP-API Entegrasyonu**: Ürün verilerini otomatik çekme
- **AI İçerik Üretimi**: OpenAI GPT-4o-mini ile otomatik gönderi oluşturma
- **Sosyal Medya Entegrasyonu**: Twitter, Instagram, TikTok desteği
- **Analitik Dashboard**: Detaylı performans takibi
- **Türkçe Arayüz**: Tamamen Türkçe kullanıcı deneyimi
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu

## 🛠 Teknoloji Yığını

### Backend
- **Python FastAPI**: Yüksek performanslı web API
- **MongoDB**: NoSQL veritabanı
- **OpenAI API**: AI destekli içerik üretimi
- **Amazon SP-API**: Ürün veri entegrasyonu
- **Twitter API**: Sosyal medya paylaşımı

### Frontend  
- **React.js**: Modern UI kütüphanesi
- **TypeScript**: Type-safe geliştirme
- **Tailwind CSS**: Utility-first CSS framework
- **React Query**: Server state yönetimi
- **React Router**: SPA routing

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- Python 3.9+
- MongoDB 5.0+

### Backend Kurulumu

1. Backend dizinine gidin:
```bash
cd backend
```

2. Python sanal ortamı oluşturun:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# veya
venv\Scripts\activate     # Windows
```

3. Bağımlılıkları yükleyin:
```bash
pip install -r requirements.txt
```

4. Environment variables dosyasını oluşturun:
```bash
cp ../.env.example .env
# .env dosyasını düzenleyip API anahtarlarınızı ekleyin
```

5. Uygulamayı başlatın:
```bash
python main.py
```

Backend http://localhost:8000 adresinde çalışacaktır.

### Frontend Kurulumu

1. Frontend dizinine gidin:
```bash
cd frontend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

Frontend http://localhost:3000 adresinde çalışacaktır.

## 🔧 Yapılandırma

### Amazon SP-API
1. Amazon Developer Console'dan LWA credentials alın
2. SP-API Access için başvuru yapın
3. Marketplace ID'nizi belirleyin (Türkiye: A33AVAJ2PDY3EV)

### OpenAI API
1. OpenAI hesabı oluşturun
2. API anahtarı alın
3. GPT-4o-mini modelini kullanın

### Twitter API
1. Twitter Developer Portal'dan hesap oluşturun
2. App oluşturun ve API anahtarlarını alın
3. OAuth 1.0a credentials'larını yapılandırın

### MongoDB
1. MongoDB kurulumu yapın veya MongoDB Atlas kullanın
2. Veritabanı bağlantı string'ini `.env` dosyasına ekleyin

## 📚 API Dokümantasyonu

Backend çalıştırıldıktan sonra API dokümantasyonuna şu adreslerden erişebilirsiniz:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🎯 Kullanım

1. **Kayıt/Giriş**: Platform hesabınızı oluşturun
2. **Amazon Bağlantısı**: Amazon SP-API credentials'larınızı ekleyin
3. **Twitter Bağlantısı**: Twitter API anahtarlarınızı yapılandırın
4. **Ürün Senkronizasyonu**: Amazon'dan ürünlerinizi çekin
5. **AI Gönderi Oluşturma**: Ürünleriniz için otomatik içerik üretin
6. **Sosyal Medya Paylaşımı**: Gönderilerinizi Twitter'da yayınlayın
7. **Analitik**: Performansınızı takip edin

## 📊 Özellikler

### Dashboard
- Genel performans metrikleri
- Son aktiviteler
- Hızlı işlem butonları

### Ürün Yönetimi
- Amazon ürün listesi
- Kategori filtreleme
- Arama ve filtreleme
- Ürün detayları

### Gönderi Yönetimi
- AI destekli içerik üretimi
- Platform seçimi (Twitter, Instagram, TikTok)
- Gönderi önizleme
- Zamanlama (gelecek özellik)

### Analitik
- Platform bazlı performans
- Etkileşim oranları
- Trend analizi
- AI önerileri

## 🔒 Güvenlik

- JWT token tabanlı kimlik doğrulama
- API rate limiting
- Environment variables ile gizli bilgi yönetimi
- CORS yapılandırması
- Input validation

## 🤝 Katkıda Bulunma

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 Destek

Herhangi bir sorun yaşarsanız:
- GitHub Issues kullanın
- E-posta: support@amazondealer.com
- Dokümantasyon: [docs.amazondealer.com](https://docs.amazondealer.com)

## 🚧 Gelecek Özellikler

- [ ] Instagram Direct Publishing
- [ ] TikTok API entegrasyonu  
- [ ] Gönderi zamanlama
- [ ] A/B testing
- [ ] Çoklu hesap yönetimi
- [ ] Advanced analytics
- [ ] Mobil uygulama
- [ ] WhatsApp Business entegrasyonu

---

**Amazon Dealer** - Amazon satışlarınızı sosyal medya gücüyle büyütün! 🚀