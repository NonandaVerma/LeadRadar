"""
LeadRadar — Leads Router
Handles saving scan results to DB, fetching analytics, deleting records.

Routes:
  POST   /api/v1/leads/save              — save a scan session + all results
  GET    /api/v1/leads                   — get all scans for logged-in user
  GET    /api/v1/leads/{scanId}          — get all results for a specific scan
  DELETE /api/v1/leads/{scanId}          — delete a scan + all its results
  PATCH  /api/v1/leads/result/{resultId} — update lead status or notes
"""

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional, List
from database import executeQuery, executeWrite
from auth import verifyToken
import uuid
from datetime import datetime

router = APIRouter()


# ── Request models ─────────────────────────────────────────────────────────────

class BusinessResult(BaseModel):
    businessName: Optional[str] = None
    businessType: Optional[str] = None
    address:      Optional[str] = None
    phone:        Optional[str] = None
    hours:        Optional[str] = None
    website:      Optional[str] = None
    hasWebsite:   bool = False
    mapsUrl:      Optional[str] = None
    lat:          Optional[float] = None
    lon:          Optional[float] = None


class SaveScanRequest(BaseModel):
    categoryKey:   str
    categoryLabel: str
    city:          str
    totalFound:    int
    noWebsite:     int
    hasWebsite:    int
    results:       List[BusinessResult]


class UpdateLeadRequest(BaseModel):
    leadStatus: Optional[str] = None   # pending | reached | accepted | rejected
    notes:      Optional[str] = None


# ── Routes ─────────────────────────────────────────────────────────────────────

@router.post("/save", status_code=status.HTTP_201_CREATED)
def saveScan(body: SaveScanRequest, currentUser: dict = Depends(verifyToken)):
    """
    POST /api/v1/leads/save
    Saves a complete scan session with all business results.
    One scanId groups all results together.
    """
    scanId = str(uuid.uuid4())
    now    = datetime.utcnow()

    # Insert scan session into leadCity
    executeWrite(
        """
        INSERT INTO leadCity
          (scanId, userId, categoryKey, categoryLabel, city, totalFound, noWebsite, hasWebsite, scannedAt)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            scanId,
            currentUser["userId"],
            body.categoryKey,
            body.categoryLabel,
            body.city,
            body.totalFound,
            body.noWebsite,
            body.hasWebsite,
            now,
        )
    )

    # Insert each business result into leadBusinessResults
    for result in body.results:
        resultId = str(uuid.uuid4())
        executeWrite(
            """
            INSERT INTO leadBusinessResults
              (resultId, scanId, businessName, businessType, address, phone,
               hours, website, hasWebsite, mapsUrl, lat, lon,
               leadStatus, isDeleted, createdAt, updatedAt)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'pending', 0, %s, %s)
            """,
            (
                resultId,
                scanId,
                result.businessName,
                result.businessType,
                result.address,
                result.phone,
                result.hours,
                result.website,
                1 if result.hasWebsite else 0,
                result.mapsUrl,
                result.lat,
                result.lon,
                now,
                now,
            )
        )

    return {
        "message": f"Scan saved successfully with {len(body.results)} results.",
        "scanId":  scanId,
    }


@router.get("")
def getAllScans(currentUser: dict = Depends(verifyToken)):
    """
    GET /api/v1/leads
    Returns all scan sessions for the logged-in user.
    Used in Analytics page — shows list of all searches.
    Returns only session-level data, not individual results.
    """
    scans = executeQuery(
        """
        SELECT
            lc.scanId,
            lc.categoryKey,
            lc.categoryLabel,
            lc.city,
            lc.totalFound,
            lc.noWebsite,
            lc.hasWebsite,
            lc.scannedAt,
            COUNT(lr.id) as savedResults
        FROM leadCity lc
        LEFT JOIN leadBusinessResults lr
            ON lc.scanId = lr.scanId AND lr.isDeleted = 0
        WHERE lc.userId = %s
        GROUP BY lc.scanId
        ORDER BY lc.scannedAt DESC
        """,
        (currentUser["userId"],)
    )

    return scans or []


@router.get("/{scanId}")
def getScanResults(scanId: str, currentUser: dict = Depends(verifyToken),
                   page: int = 1, limit: int = 15):
    """
    GET /api/v1/leads/{scanId}?page=1&limit=15
    Returns paginated business results for a specific scan.
    Used in AnalyticsDetail page.
    Verifies the scan belongs to the logged-in user first.
    """
    # Verify scan belongs to this user
    scan = executeQuery(
        """
        SELECT scanId, categoryKey, categoryLabel, city, totalFound, noWebsite, hasWebsite, scannedAt
        FROM leadCity
        WHERE scanId = %s AND userId = %s
        """,
        (scanId, currentUser["userId"]),
        fetchOne=True
    )

    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found.")

    # Total count for pagination
    countRow = executeQuery(
        "SELECT COUNT(*) as total FROM leadBusinessResults WHERE scanId = %s AND isDeleted = 0",
        (scanId,),
        fetchOne=True
    )
    total  = countRow["total"] if countRow else 0
    offset = (page - 1) * limit

    # Fetch paginated results — explicit columns, no SELECT *
    results = executeQuery(
        """
        SELECT
            resultId, businessName, businessType, address,
            phone, hours, website, hasWebsite, mapsUrl,
            leadStatus, notes, createdAt
        FROM leadBusinessResults
        WHERE scanId = %s AND isDeleted = 0
        ORDER BY createdAt ASC
        LIMIT %s OFFSET %s
        """,
        (scanId, limit, offset)
    )

    return {
        "scan":        scan,
        "results":     results or [],
        "total":       total,
        "page":        page,
        "limit":       limit,
        "totalPages":  (total + limit - 1) // limit,
    }


@router.delete("/{scanId}", status_code=status.HTTP_200_OK)
def deleteScan(scanId: str, currentUser: dict = Depends(verifyToken)):
    """
    DELETE /api/v1/leads/{scanId}
    Deletes a scan session and all its results (via CASCADE).
    Verifies ownership before deleting.
    """
    scan = executeQuery(
        "SELECT scanId FROM leadCity WHERE scanId = %s AND userId = %s",
        (scanId, currentUser["userId"]),
        fetchOne=True
    )

    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found.")

    # CASCADE handles leadBusinessResults deletion automatically
    executeWrite(
        "DELETE FROM leadCity WHERE scanId = %s",
        (scanId,)
    )

    return {"message": "Scan deleted successfully."}


@router.patch("/result/{resultId}")
def updateLeadStatus(
    resultId: str,
    body: UpdateLeadRequest,
    currentUser: dict = Depends(verifyToken)
):
    """
    PATCH /api/v1/leads/result/{resultId}
    Updates lead status (pending/reached/accepted/rejected) or notes.
    Verifies the result belongs to the logged-in user via JOIN.
    """
    # Verify ownership via join
    result = executeQuery(
        """
        SELECT lr.resultId
        FROM leadBusinessResults lr
        JOIN leadCity lc ON lr.scanId = lc.scanId
        WHERE lr.resultId = %s AND lc.userId = %s AND lr.isDeleted = 0
        """,
        (resultId, currentUser["userId"]),
        fetchOne=True
    )

    if not result:
        raise HTTPException(status_code=404, detail="Result not found.")

    # Build dynamic update — only update fields that were sent
    updates = []
    params  = []

    if body.leadStatus is not None:
        validStatuses = ['pending', 'reached', 'accepted', 'rejected']
        if body.leadStatus not in validStatuses:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {validStatuses}")
        updates.append("leadStatus = %s")
        params.append(body.leadStatus)

    if body.notes is not None:
        updates.append("notes = %s")
        params.append(body.notes)

    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update.")

    updates.append("updatedAt = %s")
    params.append(datetime.utcnow())
    params.append(resultId)

    executeWrite(
        f"UPDATE leadBusinessResults SET {', '.join(updates)} WHERE resultId = %s",
        tuple(params)
    )

    return {"message": "Lead updated successfully."}


@router.delete("/result/{resultId}")
def softDeleteResult(resultId: str, currentUser: dict = Depends(verifyToken)):
    """
    DELETE /api/v1/leads/result/{resultId}
    Soft deletes a single business result (sets isDeleted = 1).
    Data preserved in DB for audit, hidden from UI.
    """
    result = executeQuery(
        """
        SELECT lr.resultId
        FROM leadBusinessResults lr
        JOIN leadCity lc ON lr.scanId = lc.scanId
        WHERE lr.resultId = %s AND lc.userId = %s AND lr.isDeleted = 0
        """,
        (resultId, currentUser["userId"]),
        fetchOne=True
    )

    if not result:
        raise HTTPException(status_code=404, detail="Result not found.")

    executeWrite(
        "UPDATE leadBusinessResults SET isDeleted = 1, updatedAt = %s WHERE resultId = %s",
        (datetime.utcnow(), resultId)
    )

    return {"message": "Result removed successfully."}