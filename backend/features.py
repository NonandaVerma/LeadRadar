# features.py
# Place in: backend/features.py
# Router: GET /api/v1/features

from fastapi import APIRouter, HTTPException
from database import getConnection

router = APIRouter()

@router.get("")
def get_features():
    """
    GET /api/v1/features
    Returns all active features sorted by display_order.
    """
    conn   = None
    cursor = None
    try:
        conn   = getConnection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                uuid,
                title,
                description,
                icon_key,
                image_url,
                display_order
            FROM features
            WHERE is_active = 1
            ORDER BY display_order ASC
        """)

        features = cursor.fetchall()

        return {
            "status": "success",
            "count":  len(features),
            "data":   features
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if cursor: cursor.close()
        if conn:   conn.close()