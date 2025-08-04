from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from app.core.config import settings
from app.core.database import get_database

router = APIRouter()

# Security setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

class UserCreate(BaseModel):
    email: str
    full_name: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    is_active: bool

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def get_user_by_email(email: str):
    db = get_database()
    user = await db.users.find_one({"email": email})
    return user

async def authenticate_user(email: str, password: str):
    user = await get_user_by_email(email)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = await get_user_by_email(email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate):
    """Yeni kullanıcı kaydı"""
    try:
        db = get_database()
        
        # Kullanıcı zaten var mı kontrol et
        existing_user = await db.users.find_one({"email": user.email})
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Bu email adresi zaten kayıtlı"
            )
        
        # Şifreyi hash'le
        hashed_password = get_password_hash(user.password)
        
        # Kullanıcıyı kaydet
        user_data = {
            "email": user.email,
            "full_name": user.full_name,
            "hashed_password": hashed_password,
            "is_active": True,
            "created_at": datetime.utcnow()
        }
        
        result = await db.users.insert_one(user_data)
        
        return UserResponse(
            id=str(result.inserted_id),
            email=user.email,
            full_name=user.full_name,
            is_active=True
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Kullanıcı kaydı yapılamadı: {str(e)}")

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Kullanıcı girişi ve token oluşturma"""
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    """Mevcut kullanıcı bilgilerini al"""
    return UserResponse(
        id=str(current_user["_id"]),
        email=current_user["email"],
        full_name=current_user["full_name"],
        is_active=current_user["is_active"]
    )

@router.post("/connect-amazon")
async def connect_amazon_account(
    client_id: str,
    client_secret: str,
    refresh_token: str,
    current_user: dict = Depends(get_current_user)
):
    """Amazon SP-API hesabını bağla"""
    try:
        db = get_database()
        
        # Amazon credentials'ları güvenli şekilde kaydet
        amazon_credentials = {
            "client_id": client_id,
            "client_secret": client_secret,
            "refresh_token": refresh_token,
            "connected_at": datetime.utcnow()
        }
        
        await db.users.update_one(
            {"_id": current_user["_id"]},
            {"$set": {"amazon_credentials": amazon_credentials}}
        )
        
        return {"message": "Amazon hesabı başarıyla bağlandı"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Amazon hesabı bağlanamadı: {str(e)}")

@router.post("/connect-twitter")
async def connect_twitter_account(
    consumer_key: str,
    consumer_secret: str,
    access_token: str,
    access_token_secret: str,
    current_user: dict = Depends(get_current_user)
):
    """Twitter hesabını bağla"""
    try:
        db = get_database()
        
        # Twitter credentials'ları güvenli şekilde kaydet
        twitter_credentials = {
            "consumer_key": consumer_key,
            "consumer_secret": consumer_secret,
            "access_token": access_token,
            "access_token_secret": access_token_secret,
            "connected_at": datetime.utcnow()
        }
        
        await db.users.update_one(
            {"_id": current_user["_id"]},
            {"$set": {"twitter_credentials": twitter_credentials}}
        )
        
        return {"message": "Twitter hesabı başarıyla bağlandı"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Twitter hesabı bağlanamadı: {str(e)}")

@router.get("/status")
async def get_connection_status(current_user: dict = Depends(get_current_user)):
    """Hesap bağlantı durumlarını kontrol et"""
    amazon_connected = bool(current_user.get("amazon_credentials"))
    twitter_connected = bool(current_user.get("twitter_credentials"))
    
    return {
        "amazon_connected": amazon_connected,
        "twitter_connected": twitter_connected,
        "user_id": str(current_user["_id"]),
        "email": current_user["email"]
    }