from fastapi import Header, HTTPException, status
from app.services.firebase import get_db
from typing import Optional

async def get_current_user(authorization: Optional[str] = Header(None)):
    """Verify team session from custom token"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header"
        )
    
    try:
        # Extract token (format: "Bearer <token>")
        token = authorization.split(" ")[1] if " " in authorization else authorization
        
        # For demo: decode simple token format "teamId:email"
        # In production: use Firebase Custom Tokens or JWT
        parts = token.split(":")
        if len(parts) != 2:
            raise ValueError("Invalid token format")
        
        team_id, email = parts
        return {"teamId": team_id, "email": email}
    
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

async def verify_admin(authorization: Optional[str] = Header(None)):
    """Verify admin access"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header"
        )
    
    try:
        token = authorization.split(" ")[1] if " " in authorization else authorization
        
        # Simple admin check - enhance with Firebase Admin SDK in production
        if token != "admin_token":
            raise ValueError("Invalid admin token")
        
        return {"role": "admin"}
    
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
