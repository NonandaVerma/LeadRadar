# MySQL connection pool

"""
LeadRadar — Database
MySQL connection using PyMySQL.
Reads credentials from .env via python-dotenv.
"""

import pymysql
import pymysql.cursors
from dotenv import load_dotenv
import os

load_dotenv()

def getConnection():
    """
    Returns a fresh PyMySQL connection.
    Always use with a try/finally to ensure connection is closed.
    Uses DictCursor so rows come back as dicts, not tuples.
    """
    return pymysql.connect(
        host     = os.getenv("DB_HOST", "localhost"),
        port     = int(os.getenv("DB_PORT", 3306)),
        user     = os.getenv("DB_USER", "root"),
        password = os.getenv("DB_PASSWORD", ""),
        database = os.getenv("DB_NAME", "leadradar"),
        cursorclass = pymysql.cursors.DictCursor,
        autocommit  = False,
    )


def executeQuery(sql: str, params: tuple = (), fetchOne: bool = False):
    """
    Utility for SELECT queries.
    - fetchOne=True  → returns single row dict or None
    - fetchOne=False → returns list of row dicts
    """
    conn = getConnection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(sql, params)
            if fetchOne:
                return cursor.fetchone()
            return cursor.fetchall()
    finally:
        conn.close()


def executeWrite(sql: str, params: tuple = ()):
    """
    Utility for INSERT / UPDATE / DELETE queries.
    Returns lastrowid (useful for INSERT).
    Commits on success, rolls back on error.
    """
    conn = getConnection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(sql, params)
        conn.commit()
        return cursor.lastrowid
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()