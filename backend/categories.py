"""
LeadRadar — Categories Router
GET /api/v1/categories — loads from DB, fully dynamic
No hardcoded category data anywhere in backend anymore.
"""

from fastapi import APIRouter, HTTPException
from database import executeQuery

router = APIRouter()


@router.get("")
def getCategories():
    """
    GET /api/v1/categories
    Returns all active categories ordered by sortOrder.
    Frontend uses iconName to dynamically render React Icons.
    Public route — no auth required (needed for landing page dropdown too).
    """
    categories = executeQuery(
        """
        SELECT categoryKey, label, iconName, amenityTags, shopTags
        FROM categories
        WHERE isActive = 1
        ORDER BY sortOrder ASC
        """,
    )

    if not categories:
        raise HTTPException(status_code=404, detail="No categories found.")

    return categories


@router.get("/{categoryKey}")
def getCategoryByKey(categoryKey: str):
    """
    GET /api/v1/categories/{categoryKey}
    Returns a single category by its key.
    Used internally when building Overpass queries.
    """
    category = executeQuery(
        """
        SELECT categoryKey, label, iconName, amenityTags, shopTags
        FROM categories
        WHERE categoryKey = %s AND isActive = 1
        """,
        (categoryKey,),
        fetchOne=True
    )

    if not category:
        raise HTTPException(status_code=404, detail=f"Category '{categoryKey}' not found.")

    return category