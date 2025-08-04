import openai
from app.core.config import settings
from typing import Dict, List

class AIContentService:
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

    async def generate_social_media_post(self, product: Dict, platform: str = "twitter", style: str = "engaging") -> str:
        """OpenAI GPT-4o-mini ile sosyal medya gönderisi oluştur"""
        
        try:
            # Platform-specific character limits and styles
            platform_configs = {
                "twitter": {"max_chars": 280, "hashtags": True, "style": "kısa ve çarpıcı"},
                "instagram": {"max_chars": 2200, "hashtags": True, "style": "görsel odaklı"},
                "tiktok": {"max_chars": 150, "hashtags": True, "style": "trend ve eğlenceli"}
            }
            
            config = platform_configs.get(platform, platform_configs["twitter"])
            
            prompt = f"""
            Türkçe bir {platform} gönderisi oluştur. Aşağıdaki ürün için {config['style']} bir içerik yaz:

            Ürün Adı: {product.get('title', '')}
            Açıklama: {product.get('description', '')}
            Fiyat: {product.get('price', '')} {product.get('currency', 'TRY')}
            Kategori: {product.get('category', '')}
            Marka: {product.get('brand', '')}

            Gereksinimler:
            - Maksimum {config['max_chars']} karakter
            - Türkçe dilinde
            - Satış odaklı ve çekici
            - Ürünün öne çıkan özelliklerini vurgula
            - Amazon'da satıldığını belirt
            {"- Uygun hashtag'ler ekle" if config['hashtags'] else ""}
            - Emoji kullan ama abartma
            - Call-to-action ekle

            Sadece gönderi içeriğini döndür, başka açıklama ekleme.
            """

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "Sen Amazon satıcıları için sosyal medya içeriği oluşturan bir AI asistanısın. Türkçe, çekici ve satış odaklı içerikler üretiyorsun."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=300,
                temperature=0.7
            )

            content = response.choices[0].message.content.strip()
            
            # Karakter limitini kontrol et
            if len(content) > config['max_chars']:
                content = content[:config['max_chars']-3] + "..."
            
            return content

        except Exception as e:
            print(f"AI Content Generation Error: {e}")
            # Fallback content
            return f"🛍️ {product.get('title', 'Harika ürün')} - Amazon'da şimdi {product.get('price', '')} {product.get('currency', 'TRY')}! #Amazon #Alışveriş #İndirim"

    async def generate_multiple_variations(self, product: Dict, platform: str = "twitter", count: int = 3) -> List[str]:
        """Aynı ürün için birden fazla gönderi varyasyonu oluştur"""
        variations = []
        styles = ["engaging", "informative", "promotional"]
        
        for i in range(min(count, len(styles))):
            try:
                content = await self.generate_social_media_post(product, platform, styles[i])
                variations.append(content)
            except Exception as e:
                print(f"Error generating variation {i+1}: {e}")
                continue
        
        return variations

    async def optimize_for_trends(self, product: Dict, platform: str = "twitter") -> str:
        """Trend analizi ile optimize edilmiş içerik oluştur"""
        
        # Bu fonksiyon gelecekte trend API'leri ile entegre edilebilir
        # Şu anda temel optimizasyon uygulayacağız
        
        try:
            trend_prompt = f"""
            {product.get('title', '')} ürünü için güncel Türkiye trendlerini göz önünde bulundurarak 
            {platform} gönderisi oluştur. 

            Ürün Bilgileri:
            - Başlık: {product.get('title', '')}
            - Fiyat: {product.get('price', '')} {product.get('currency', 'TRY')}
            - Kategori: {product.get('category', '')}

            Güncel trend faktörleri:
            - Türkiye'deki alışveriş trendleri
            - Mevsimsel özellikler
            - Popüler hashtag'ler
            - Lokal ifadeler ve kültürel referanslar

            Türkçe, çekici ve trend uyumlu bir gönderi oluştur.
            """

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "Sen Türkiye pazarını çok iyi bilen bir sosyal medya uzmanısın."},
                    {"role": "user", "content": trend_prompt}
                ],
                max_tokens=250,
                temperature=0.8
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            print(f"Trend optimization error: {e}")
            return await self.generate_social_media_post(product, platform)

ai_content_service = AIContentService()