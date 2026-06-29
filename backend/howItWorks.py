# how_it_works.py
# Place in: backend/how_it_works.py
# Router: GET /api/v1/how-it-works

from fastapi import APIRouter, HTTPException
from database import getConnection

router = APIRouter()

@router.get("")
def get_how_it_works():
    conn   = None
    cursor = None
    try:
        conn   = getConnection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                uuid,
                icon_key,
                tag,
                title,
                description,
                display_order
            FROM how_it_works
            WHERE is_active = 1
            ORDER BY display_order ASC
        """)

        rows  = cursor.fetchall()  
        steps = list(rows)

        return {
            "status": "success",
            "count":  len(steps),
            "data":   steps
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if cursor: cursor.close()
        if conn:   conn.close()