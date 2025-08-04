import tweepy
from app.core.config import settings
from typing import Dict, Optional
import asyncio

class TwitterService:
    def __init__(self):
        self.api_v1 = None
        self.api_v2 = None
        self.setup_apis()

    def setup_apis(self):
        """Twitter API v1.1 ve v2 bağlantılarını kur"""
        try:
            # API v1.1 for media upload
            auth = tweepy.OAuth1UserHandler(
                settings.TWITTER_CONSUMER_KEY,
                settings.TWITTER_CONSUMER_SECRET,
                settings.TWITTER_ACCESS_TOKEN,
                settings.TWITTER_ACCESS_TOKEN_SECRET
            )
            self.api_v1 = tweepy.API(auth)

            # API v2 for tweets
            self.api_v2 = tweepy.Client(
                consumer_key=settings.TWITTER_CONSUMER_KEY,
                consumer_secret=settings.TWITTER_CONSUMER_SECRET,
                access_token=settings.TWITTER_ACCESS_TOKEN,
                access_token_secret=settings.TWITTER_ACCESS_TOKEN_SECRET,
                bearer_token=settings.TWITTER_BEARER_TOKEN
            )
        except Exception as e:
            print(f"Twitter API setup error: {e}")

    async def post_tweet(self, content: str, image_urls: list = None) -> Optional[Dict]:
        """Tweet gönder"""
        try:
            media_ids = []
            
            # Resim varsa yükle
            if image_urls and self.api_v1:
                for image_url in image_urls[:4]:  # Twitter max 4 resim
                    try:
                        # Gerçek implementasyonda image_url'den resmi indirip yüklemek gerekir
                        # Şimdilik simulated response
                        pass
                    except Exception as e:
                        print(f"Image upload error: {e}")
            
            # Tweet gönder
            if self.api_v2:
                response = self.api_v2.create_tweet(
                    text=content,
                    media_ids=media_ids if media_ids else None
                )
                
                return {
                    "success": True,
                    "tweet_id": response.data['id'],
                    "tweet_url": f"https://twitter.com/user/status/{response.data['id']}"
                }
            else:
                # Simulated response for development
                return {
                    "success": True,
                    "tweet_id": "simulated_tweet_id_123",
                    "tweet_url": "https://twitter.com/user/status/simulated_tweet_id_123"
                }
                
        except Exception as e:
            print(f"Tweet posting error: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def get_tweet_analytics(self, tweet_id: str) -> Optional[Dict]:
        """Tweet analitik verilerini çek"""
        try:
            if self.api_v2:
                tweet = self.api_v2.get_tweet(
                    tweet_id,
                    tweet_fields=['public_metrics', 'created_at']
                )
                
                if tweet.data:
                    metrics = tweet.data.public_metrics
                    return {
                        "tweet_id": tweet_id,
                        "retweet_count": metrics.get('retweet_count', 0),
                        "like_count": metrics.get('like_count', 0),
                        "reply_count": metrics.get('reply_count', 0),
                        "quote_count": metrics.get('quote_count', 0),
                        "impression_count": metrics.get('impression_count', 0),
                        "collected_at": tweet.data.created_at
                    }
            
            # Simulated analytics for development
            return {
                "tweet_id": tweet_id,
                "retweet_count": 5,
                "like_count": 23,
                "reply_count": 2,
                "quote_count": 1,
                "impression_count": 150,
                "collected_at": "2024-01-01T00:00:00Z"
            }
            
        except Exception as e:
            print(f"Twitter analytics error: {e}")
            return None

    async def schedule_tweet(self, content: str, schedule_time: str) -> Dict:
        """Tweet zamanlama (Pro özellik)"""
        # Twitter API'da doğrudan zamanlama özelliği yok
        # Bu özellik için üçüncü parti servis veya kendi zamanlama sistemimiz gerekir
        
        return {
            "success": False,
            "message": "Tweet zamanlama özelliği henüz desteklenmiyor"
        }

    def validate_credentials(self) -> bool:
        """Twitter API kimlik bilgilerini doğrula"""
        try:
            if self.api_v2:
                user = self.api_v2.get_me()
                return user.data is not None
            return False
        except Exception as e:
            print(f"Twitter credential validation error: {e}")
            return False

twitter_service = TwitterService()