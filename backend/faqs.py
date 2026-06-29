# faqs.py
# Place in: backend/faqs.py
# Router: GET /api/v1/faqs

from fastapi import APIRouter, HTTPException
from database import getConnection

router = APIRouter()

@router.get("")
def get_faqs():
    conn   = None
    cursor = None
    try:
        conn   = getConnection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                uuid,
                question,
                answer,
                display_order
            FROM faqs
            WHERE is_active = 1
            ORDER BY display_order ASC
        """)

        rows = cursor.fetchall()
        faqs = list(rows)

        return {
            "status": "success",
            "count":  len(faqs),
            "data":   faqs
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if cursor: cursor.close()
        if conn:   conn.close()