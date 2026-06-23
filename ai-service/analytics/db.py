# analytics/db.py
import os
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:password@localhost:5432/physioai"
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)


def query(sql: str, params: dict = {}) -> pd.DataFrame:
    """Execute SQL and return DataFrame."""
    with engine.connect() as conn:
        return pd.read_sql_query(text(sql), conn, params=params)


def scalar(sql: str, params: dict = {}) -> any:
    """Return a single value."""
    with engine.connect() as conn:
        result = conn.execute(text(sql), params)
        row = result.fetchone()
        return row[0] if row else 0