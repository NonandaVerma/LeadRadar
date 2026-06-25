# Register, Login, Forgot/Reset password routes

"""
LeadRadar — Auth Router
Versioned under /api/v1/auth/

API Design principles followed:
- Return only what the client needs (never SELECT *)
- Never expose auto-increment id, only userId (UUID)
- Never return password hash in any response
- Proper HTTP status codes
- Descriptive error messages
"""

from fastapi import APIRouter, HTTPException, Depends, Request, status
from pydantic import BaseModel, EmailStr
from database import executeQuery, executeWrite
from mailer import sendPasswordResetPin
import bcrypt
import jwt
import uuid
import random
import os
import time
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

JWT_SECRET    = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")


# ── Pydantic models — define exactly what we accept and return ─────────────────

class RegisterRequest(BaseModel):
    fullName: str
    email:    EmailStr
    phone:    str
    password: str

class LoginRequest(BaseModel):
    email:    EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class VerifyPinRequest(BaseModel):
    email:   EmailStr
    pin:     str

class ResetPasswordRequest(BaseModel):
    email:       EmailStr
    pin:         str
    newPassword: str

# Response model — ONLY these fields ever leave the server
class UserResponse(BaseModel):
    userId:    str
    fullName:  str
    email:     str
    phone:     str
    createdAt: datetime

    class Config:
        from_attributes = True


# ── Helpers ────────────────────────────────────────────────────────────────────

def hashPassword(plain: str) -> str:
    """Hashes password using bcrypt — one-way, cannot be reversed."""
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def verifyPassword(plain: str, hashed: str) -> bool:
    """Compares plain password against stored bcrypt hash."""
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def generateToken(userId: str, email: str) -> str:
    """
    Generates a JWT token.
    No expiry — invalidated on logout by frontend deleting it.
    """
    payload = {
        "userId": userId,
        "email":  email,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verifyToken(request: Request):
    """
    Dependency — verifies JWT on every protected route.
    Reads Authorization header directly to avoid HTTPBearer version quirks.
    Returns decoded payload (userId, email) — NOT full user from DB.
    """
    auth_header = request.headers.get("Authorization", "")

    if not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail      = "Missing or invalid Authorization header.",
            headers     = {"WWW-Authenticate": "Bearer"},
        )

    token = auth_header.split(" ", 1)[1].strip()

    if not token:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail      = "Empty token.",
            headers     = {"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms = [JWT_ALGORITHM],
           
        )
        return payload
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail      = "Invalid or expired token. Please log in again.",
            headers     = {"WWW-Authenticate": "Bearer"},
        )


def generatePin() -> str:
    """Generates a random 4-digit PIN as string."""
    return str(random.randint(1000, 9999))


# ── Routes ─────────────────────────────────────────────────────────────────────

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest):
    """
    POST /api/v1/auth/register
    Creates a new user account.
    Returns: userId and basic info — never password.
    """
    # Check if email already exists
    existing = executeQuery(
        "SELECT userId FROM users WHERE email = %s",
        (body.email,),
        fetchOne=True
    )
    if existing:
        raise HTTPException(
            status_code = status.HTTP_409_CONFLICT,
            detail      = "An account with this email already exists."
        )

    # Generate UUID for public-facing userId
    newUserId = str(uuid.uuid4())
    hashed    = hashPassword(body.password)
    now       = datetime.utcnow()

    executeWrite(
        """
        INSERT INTO users (userId, fullName, email, phone, password, createdAt, updatedAt)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """,
        (newUserId, body.fullName, body.email, body.phone, hashed, now, now)
    )

    return {
        "message":  "Account created successfully.",
        "userId":   newUserId,
        "fullName": body.fullName,
        "email":    body.email,
    }


@router.post("/login")
def login(body: LoginRequest):
    """
    POST /api/v1/auth/login
    Verifies credentials, returns JWT token.
    Returns: token + minimal user info.
    Never returns: password, id (auto-increment), updatedAt.
    """
    # Fetch only what we need — not SELECT *
    user = executeQuery(
        "SELECT userId, fullName, email, phone, password, createdAt FROM users WHERE email = %s",
        (body.email,),
        fetchOne=True
    )

    if not user:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail      = "No account found with this email."
        )

    if not verifyPassword(body.password, user["password"]):
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail      = "Incorrect password."
        )

    token = generateToken(user["userId"], user["email"])

    # Return only necessary fields — remove password from response
    return {
        "token":    token,
        "userId":   user["userId"],
        "fullName": user["fullName"],
        "email":    user["email"],
        "phone":    user["phone"],
    }


@router.get("/me")
def getMe(currentUser: dict = Depends(verifyToken)):
    """
    GET /api/v1/auth/me
    Returns current logged-in user's profile.
    This is the RIGHT way — fetch only needed fields by userId from token.
    The junior mistake: GET /users/id=123 fetching everything.
    Here we use userId from token (already verified) to fetch specific fields.
    """
    user = executeQuery(
        # Explicit columns — never SELECT *
        "SELECT userId, fullName, email, phone, createdAt FROM users WHERE userId = %s",
        (currentUser["userId"],),
        fetchOne=True
    )

    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    return user


@router.post("/forgot-password")
def forgotPassword(body: ForgotPasswordRequest):
    """
    POST /api/v1/auth/forgot-password
    Sends a 4-digit PIN to the user's email.
    Always returns 200 — don't reveal if email exists (security best practice).
    """
    user = executeQuery(
        "SELECT userId, fullName, email FROM users WHERE email = %s",
        (body.email,),
        fetchOne=True
    )

    # Security: same response whether email exists or not
    # Prevents email enumeration attacks
    if not user:
        return {"message": "If this email is registered, a PIN has been sent."}

    # Invalidate any existing unused pins for this user
    executeWrite(
        "UPDATE password_reset_pins SET used = 1 WHERE userId = %s AND used = 0",
        (user["userId"],)
    )

    # Generate and hash the PIN
    pin       = generatePin()
    hashedPin = hashPassword(pin)
    expiresAt = datetime.utcnow() + timedelta(minutes=15)

    executeWrite(
        """
        INSERT INTO password_reset_pins (userId, pin, expiresAt, attempts, used, createdAt)
        VALUES (%s, %s, %s, 0, 0, %s)
        """,
        (user["userId"], hashedPin, expiresAt, datetime.utcnow())
    )

    # Send email with plain PIN (hashed version stored in DB)
    sendPasswordResetPin(user["email"], user["fullName"], pin)

    return {"message": "If this email is registered, a PIN has been sent."}


@router.post("/verify-pin")
def verifyPin(body: VerifyPinRequest):
    """
    POST /api/v1/auth/verify-pin
    Verifies the PIN entered by user.
    Max 5 attempts — after that PIN is invalidated.
    """
    user = executeQuery(
        "SELECT userId FROM users WHERE email = %s",
        (body.email,),
        fetchOne=True
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    pinRecord = executeQuery(
        """
        SELECT id, pin, expiresAt, attempts, used
        FROM password_reset_pins
        WHERE userId = %s AND used = 0
        ORDER BY createdAt DESC LIMIT 1
        """,
        (user["userId"],),
        fetchOne=True
    )

    if not pinRecord:
        raise HTTPException(status_code=400, detail="No active PIN found. Please request a new one.")

    # Check expiry
    if datetime.utcnow() > pinRecord["expiresAt"]:
        executeWrite("UPDATE password_reset_pins SET used = 1 WHERE id = %s", (pinRecord["id"],))
        raise HTTPException(status_code=400, detail="PIN has expired. Please request a new one.")

    # Check max attempts
    if pinRecord["attempts"] >= 5:
        executeWrite("UPDATE password_reset_pins SET used = 1 WHERE id = %s", (pinRecord["id"],))
        raise HTTPException(status_code=400, detail="Too many attempts. Please request a new PIN.")

    # Verify PIN
    if not verifyPassword(body.pin, pinRecord["pin"]):
        # Increment attempts
        executeWrite(
            "UPDATE password_reset_pins SET attempts = attempts + 1 WHERE id = %s",
            (pinRecord["id"],)
        )
        remaining = 4 - pinRecord["attempts"]
        raise HTTPException(
            status_code=400,
            detail=f"Incorrect PIN. {remaining} attempt(s) remaining."
        )

    return {"message": "PIN verified successfully.", "verified": True}


@router.post("/reset-password")
def resetPassword(body: ResetPasswordRequest):
    """
    POST /api/v1/auth/reset-password
    Resets password after PIN is verified.
    Marks PIN as used after successful reset.
    """
    user = executeQuery(
        "SELECT userId FROM users WHERE email = %s",
        (body.email,),
        fetchOne=True
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    pinRecord = executeQuery(
        """
        SELECT id, pin, expiresAt, attempts, used
        FROM password_reset_pins
        WHERE userId = %s AND used = 0
        ORDER BY createdAt DESC LIMIT 1
        """,
        (user["userId"],),
        fetchOne=True
    )

    if not pinRecord:
        raise HTTPException(status_code=400, detail="No active PIN. Please request a new one.")

    if datetime.utcnow() > pinRecord["expiresAt"]:
        raise HTTPException(status_code=400, detail="PIN has expired.")

    if pinRecord["attempts"] >= 5:
        raise HTTPException(status_code=400, detail="Too many attempts. Please request a new PIN.")

    if not verifyPassword(body.pin, pinRecord["pin"]):
        executeWrite(
            "UPDATE password_reset_pins SET attempts = attempts + 1 WHERE id = %s",
            (pinRecord["id"],)
        )
        raise HTTPException(status_code=400, detail="Incorrect PIN.")

    # Hash new password and update
    newHashed = hashPassword(body.newPassword)
    executeWrite(
        "UPDATE users SET password = %s, updatedAt = %s WHERE userId = %s",
        (newHashed, datetime.utcnow(), user["userId"])
    )

    # Mark PIN as used — one-time use enforced
    executeWrite(
        "UPDATE password_reset_pins SET used = 1 WHERE id = %s",
        (pinRecord["id"],)
    )

    return {"message": "Password reset successfully. Please log in with your new password."}