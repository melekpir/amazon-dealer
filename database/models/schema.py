# MongoDB Collections
from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime

# Users Collection
"""
{
  "_id": ObjectId,
  "email": "user@example.com",
  "full_name": "User Name",
  "hashed_password": "bcrypt_hash",
  "amazon_seller_id": "seller_id",
  "amazon_credentials": {
    "client_id": "encrypted",
    "client_secret": "encrypted", 
    "refresh_token": "encrypted",
    "connected_at": datetime
  },
  "twitter_credentials": {
    "consumer_key": "encrypted",
    "consumer_secret": "encrypted",
    "access_token": "encrypted", 
    "access_token_secret": "encrypted",
    "connected_at": datetime
  },
  "is_active": true,
  "created_at": datetime
}
"""

# Products Collection
"""
{
  "_id": ObjectId,
  "user_id": ObjectId,
  "asin": "B08N5WRWNW",
  "title": "Product Title",
  "description": "Product description",
  "price": 299.99,
  "currency": "TRY",
  "image_urls": ["url1", "url2"],
  "category": "Electronics",
  "brand": "Brand Name",
  "last_updated": datetime
}
"""

# Social Media Posts Collection  
"""
{
  "_id": ObjectId,
  "user_id": ObjectId,
  "product_id": ObjectId,
  "platform": "twitter", // "instagram", "tiktok"
  "content": "Post content text",
  "ai_generated": true,
  "posted": false,
  "post_id": "platform_specific_id",
  "created_at": datetime,
  "posted_at": datetime
}
"""

# Analytics Collection
"""
{
  "_id": ObjectId,
  "user_id": ObjectId,
  "post_id": ObjectId,
  "platform": "twitter",
  "metrics": {
    "likes": 25,
    "retweets": 5,
    "replies": 3,
    "impressions": 150,
    "engagement_rate": 6.8
  },
  "collected_at": datetime
}
"""

# Sample data for development
SAMPLE_USERS = [
    {
        "email": "demo@amazondealer.com",
        "full_name": "Demo User",
        "hashed_password": "$2b$12$demo_hash",
        "is_active": True,
        "created_at": datetime.utcnow()
    }
]

SAMPLE_PRODUCTS = [
    {
        "asin": "B08N5WRWNW",
        "title": "iPhone 15 Pro 128GB Doğal Titanyum",
        "description": "A17 Pro çip, Titanium tasarım, gelişmiş kamera sistemi",
        "price": 52999.00,
        "currency": "TRY",
        "image_urls": ["https://example.com/iphone15.jpg"],
        "category": "Elektronik",
        "brand": "Apple"
    },
    {
        "asin": "B09G9FPHY6",
        "title": "Samsung Galaxy S24 Ultra 256GB",
        "description": "S Pen ile güçlü performans, AI destekli fotoğrafçılık",
        "price": 44999.00,
        "currency": "TRY",
        "image_urls": ["https://example.com/galaxy-s24.jpg"],
        "category": "Elektronik", 
        "brand": "Samsung"
    }
]