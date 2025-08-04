from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.services.amazon_service import amazon_service
from app.models.models import Product
from app.core.database import get_database

router = APIRouter()

@router.get("/", response_model=List[dict])
async def get_products(skip: int = 0, limit: int = 10):
    """Kullanıcının Amazon ürünlerini listele"""
    try:
        # Gerçek implementasyonda user_id gerekir
        products = await amazon_service.get_products("seller_id_example")
        return products[skip:skip + limit]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ürünler alınamadı: {str(e)}")

@router.get("/{asin}")
async def get_product_detail(asin: str):
    """Belirli bir ASIN için ürün detayı"""
    try:
        product = await amazon_service.get_product_details(asin)
        if not product:
            raise HTTPException(status_code=404, detail="Ürün bulunamadı")
        return product
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ürün detayı alınamadı: {str(e)}")

@router.post("/sync")
async def sync_products():
    """Amazon'dan ürünleri senkronize et"""
    try:
        # Gerçek implementasyonda user authentication gerekir
        products = await amazon_service.get_products("seller_id_example")
        
        # Ürünleri veritabanına kaydet
        db = get_database()
        
        saved_count = 0
        for product_data in products:
            # Ürün zaten varsa güncelle, yoksa ekle
            existing = await db.products.find_one({"asin": product_data["asin"]})
            if existing:
                await db.products.update_one(
                    {"asin": product_data["asin"]}, 
                    {"$set": product_data}
                )
            else:
                await db.products.insert_one(product_data)
                saved_count += 1
        
        return {"message": f"{saved_count} yeni ürün senkronize edildi"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Senkronizasyon hatası: {str(e)}")

@router.get("/categories/")
async def get_categories():
    """Ürün kategorilerini listele"""
    try:
        # Simulated categories for Turkish market
        categories = [
            "Elektronik",
            "Giyim",
            "Ev & Yaşam",
            "Kitap",
            "Oyuncak",
            "Spor & Outdoor",
            "Güzellik & Kişisel Bakım",
            "Otomotiv",
            "Bahçe",
            "Pet Shop"
        ]
        return {"categories": categories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Kategoriler alınamadı: {str(e)}")