from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from app.services.ai_service import ai_content_service
from app.services.twitter_service import twitter_service
from app.models.models import SocialMediaPost
from app.core.database import get_database

router = APIRouter()

class PostCreateRequest(BaseModel):
    product_id: str
    platform: str = "twitter"
    custom_content: Optional[str] = None
    generate_ai: bool = True

class PostResponse(BaseModel):
    id: str
    content: str
    platform: str
    ai_generated: bool
    posted: bool

@router.post("/generate")
async def generate_post(request: PostCreateRequest):
    """AI ile sosyal medya gönderisi oluştur"""
    try:
        db = get_database()
        
        # Ürün bilgilerini al
        # Gerçek implementasyonda ObjectId conversion gerekir
        product = await db.products.find_one({"_id": request.product_id})
        if not product:
            raise HTTPException(status_code=404, detail="Ürün bulunamadı")

        # AI içerik oluştur veya custom content kullan
        if request.generate_ai:
            content = await ai_content_service.generate_social_media_post(
                product, request.platform
            )
        else:
            content = request.custom_content or "Varsayılan içerik"

        # Gönderiyi veritabanına kaydet
        post_data = {
            "user_id": "user_id_example",  # Gerçek implementasyonda current user
            "product_id": request.product_id,
            "platform": request.platform,
            "content": content,
            "ai_generated": request.generate_ai,
            "posted": False
        }

        result = await db.social_media_posts.insert_one(post_data)
        post_data["_id"] = str(result.inserted_id)

        return {
            "id": str(result.inserted_id),
            "content": content,
            "platform": request.platform,
            "ai_generated": request.generate_ai,
            "posted": False
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gönderi oluşturulamadı: {str(e)}")

@router.post("/{post_id}/publish")
async def publish_post(post_id: str):
    """Gönderiyi sosyal medyada yayınla"""
    try:
        db = get_database()
        
        # Gönderiyi al
        post = await db.social_media_posts.find_one({"_id": post_id})
        if not post:
            raise HTTPException(status_code=404, detail="Gönderi bulunamadı")

        if post["posted"]:
            raise HTTPException(status_code=400, detail="Gönderi zaten yayınlanmış")

        # Platform'a göre yayınla
        if post["platform"] == "twitter":
            result = await twitter_service.post_tweet(post["content"])
            
            if result["success"]:
                # Gönderiyi güncelle
                await db.social_media_posts.update_one(
                    {"_id": post_id},
                    {
                        "$set": {
                            "posted": True,
                            "post_id": result["tweet_id"],
                            "posted_at": "2024-01-01T00:00:00Z"  # Gerçek timestamp
                        }
                    }
                )
                
                return {
                    "success": True,
                    "platform": "twitter",
                    "post_url": result["tweet_url"],
                    "message": "Tweet başarıyla yayınlandı"
                }
            else:
                raise HTTPException(status_code=500, detail=f"Tweet yayınlanamadı: {result.get('error', 'Bilinmeyen hata')}")
        
        else:
            raise HTTPException(status_code=400, detail=f"Platform '{post['platform']}' henüz desteklenmiyor")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Yayınlama hatası: {str(e)}")

@router.get("/", response_model=List[PostResponse])
async def get_posts(skip: int = 0, limit: int = 10):
    """Kullanıcının gönderilerini listele"""
    try:
        db = get_database()
        
        posts = await db.social_media_posts.find(
            {"user_id": "user_id_example"}  # Gerçek implementasyonda current user
        ).skip(skip).limit(limit).to_list(limit)
        
        result = []
        for post in posts:
            result.append({
                "id": str(post["_id"]),
                "content": post["content"],
                "platform": post["platform"],
                "ai_generated": post["ai_generated"],
                "posted": post["posted"]
            })
        
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gönderiler alınamadı: {str(e)}")

@router.get("/variations/{product_id}")
async def get_post_variations(product_id: str, platform: str = "twitter", count: int = 3):
    """Bir ürün için farklı gönderi varyasyonları oluştur"""
    try:
        db = get_database()
        
        # Ürün bilgilerini al
        product = await db.products.find_one({"_id": product_id})
        if not product:
            raise HTTPException(status_code=404, detail="Ürün bulunamadı")

        # AI ile varyasyonlar oluştur
        variations = await ai_content_service.generate_multiple_variations(
            product, platform, count
        )

        return {
            "product_id": product_id,
            "platform": platform,
            "variations": variations
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Varyasyonlar oluşturulamadı: {str(e)}")

@router.delete("/{post_id}")
async def delete_post(post_id: str):
    """Gönderiyi sil"""
    try:
        db = get_database()
        
        result = await db.social_media_posts.delete_one({"_id": post_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Gönderi bulunamadı")
        
        return {"message": "Gönderi başarıyla silindi"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gönderi silinemedi: {str(e)}")