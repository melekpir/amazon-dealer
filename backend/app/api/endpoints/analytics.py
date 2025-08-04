from fastapi import APIRouter, HTTPException
from typing import Dict, List
from app.services.twitter_service import twitter_service
from app.core.database import get_database
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_analytics():
    """Genel analitik dashboard verilerini döndür"""
    try:
        db = get_database()
        
        # Toplam gönderi sayısı
        total_posts = await db.social_media_posts.count_documents(
            {"user_id": "user_id_example"}  # Gerçek implementasyonda current user
        )
        
        # Yayınlanan gönderi sayısı
        published_posts = await db.social_media_posts.count_documents(
            {"user_id": "user_id_example", "posted": True}
        )
        
        # Platform dağılımı
        platform_distribution = await db.social_media_posts.aggregate([
            {"$match": {"user_id": "user_id_example"}},
            {"$group": {"_id": "$platform", "count": {"$sum": 1}}}
        ]).to_list(100)
        
        # Son 30 günün gönderi sayısı (simulated data)
        recent_posts = [
            {"date": "2024-01-01", "count": 5},
            {"date": "2024-01-02", "count": 3},
            {"date": "2024-01-03", "count": 7},
            {"date": "2024-01-04", "count": 2},
            {"date": "2024-01-05", "count": 4}
        ]
        
        # En performanslı gönderiler (simulated)
        top_posts = [
            {
                "id": "post_1",
                "content": "Harika ürün tanıtımı...",
                "platform": "twitter",
                "likes": 45,
                "shares": 12,
                "engagement_rate": 8.5
            },
            {
                "id": "post_2", 
                "content": "İndirimli ürün fırsatı...",
                "platform": "twitter",
                "likes": 38,
                "shares": 8,
                "engagement_rate": 7.2
            }
        ]
        
        return {
            "total_posts": total_posts,
            "published_posts": published_posts,
            "engagement_rate": 6.8,  # Simulated average
            "platform_distribution": platform_distribution,
            "recent_activity": recent_posts,
            "top_performing_posts": top_posts,
            "total_impressions": 1250,  # Simulated
            "total_engagement": 156  # Simulated
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analitik verileri alınamadı: {str(e)}")

@router.get("/post/{post_id}")
async def get_post_analytics(post_id: str):
    """Belirli bir gönderi için detaylı analitik"""
    try:
        db = get_database()
        
        # Gönderiyi al
        post = await db.social_media_posts.find_one({"_id": post_id})
        if not post:
            raise HTTPException(status_code=404, detail="Gönderi bulunamadı")
        
        if not post["posted"]:
            return {
                "post_id": post_id,
                "status": "not_published",
                "message": "Gönderi henüz yayınlanmamış"
            }
        
        # Platform'a göre analitik al
        analytics_data = {}
        
        if post["platform"] == "twitter" and post.get("post_id"):
            twitter_analytics = await twitter_service.get_tweet_analytics(post["post_id"])
            if twitter_analytics:
                analytics_data = twitter_analytics
        
        # Veritabanından kaydedilmiş analitikleri al
        saved_analytics = await db.analytics.find(
            {"post_id": post_id}
        ).sort("collected_at", -1).to_list(30)  # Son 30 kayıt
        
        return {
            "post_id": post_id,
            "platform": post["platform"],
            "content": post["content"],
            "posted_at": post.get("posted_at"),
            "current_metrics": analytics_data,
            "historical_data": saved_analytics,
            "performance_summary": {
                "total_engagement": analytics_data.get("like_count", 0) + 
                                   analytics_data.get("retweet_count", 0) + 
                                   analytics_data.get("reply_count", 0),
                "engagement_rate": 5.2,  # Calculated based on impressions
                "reach": analytics_data.get("impression_count", 0),
                "best_performing_time": "14:30"  # Simulated insight
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gönderi analitiği alınamadı: {str(e)}")

@router.get("/trends")
async def get_trending_hashtags():
    """Trend hashtag'leri ve öneriler"""
    try:
        # Gerçek implementasyonda Twitter API'den trend verisi alınır
        trending_hashtags = [
            {"hashtag": "#BlackFriday", "tweet_count": 1500000, "trend_score": 95},
            {"hashtag": "#İndirim", "tweet_count": 45000, "trend_score": 78},
            {"hashtag": "#Amazon", "tweet_count": 890000, "trend_score": 85},
            {"hashtag": "#AlışverişFırsatı", "tweet_count": 12000, "trend_score": 65},
            {"hashtag": "#TeknolojiHaber", "tweet_count": 23000, "trend_score": 72}
        ]
        
        # Kategori bazlı öneriler
        category_suggestions = {
            "Elektronik": ["#teknoloji", "#gadget", "#elektronik", "#innovation"],
            "Giyim": ["#moda", "#stil", "#trend", "#fashion"],
            "Ev & Yaşam": ["#ev", "#dekorasyon", "#yaşam", "#home"],
            "Kitap": ["#kitap", "#okuma", "#edebiyat", "#book"]
        }
        
        return {
            "trending_hashtags": trending_hashtags,
            "category_suggestions": category_suggestions,
            "updated_at": datetime.utcnow().isoformat(),
            "location": "Turkey"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trend verileri alınamadı: {str(e)}")

@router.get("/performance/comparison")
async def get_performance_comparison():
    """Platform performans karşılaştırması"""
    try:
        # Simulated comparison data
        platform_performance = {
            "twitter": {
                "total_posts": 25,
                "avg_engagement": 6.8,
                "avg_reach": 245,
                "best_time": "15:00-16:00",
                "top_content_type": "Ürün tanıtımı"
            },
            "instagram": {
                "total_posts": 12,
                "avg_engagement": 8.2,
                "avg_reach": 180,
                "best_time": "20:00-21:00", 
                "top_content_type": "Görsel odaklı"
            },
            "tiktok": {
                "total_posts": 5,
                "avg_engagement": 12.5,
                "avg_reach": 320,
                "best_time": "19:00-20:00",
                "top_content_type": "Video içerik"
            }
        }
        
        recommendations = [
            "Instagram'da görsel kalitesini artırın",
            "Twitter'da etkileşim zamanlarını optimize edin",
            "TikTok'ta video içerik stratejinizi geliştirin"
        ]
        
        return {
            "platform_performance": platform_performance,
            "recommendations": recommendations,
            "analysis_period": "Son 30 gün",
            "updated_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Performans karşılaştırması alınamadı: {str(e)}")