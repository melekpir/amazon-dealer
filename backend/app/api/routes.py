from fastapi import APIRouter
from app.api.endpoints import products, posts, analytics, auth

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(products.router, prefix="/products", tags=["Products"])
api_router.include_router(posts.router, prefix="/posts", tags=["Social Media Posts"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])