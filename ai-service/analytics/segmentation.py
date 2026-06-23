# analytics/segmentation.py
import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from .db import query


def rfm_segmentation() -> dict:
    """
    RFM Analysis:
    R = Recency   (days since last booking)
    F = Frequency (total bookings)
    M = Monetary  (total spent)
    """
    df = query("""
        SELECT
            b."patientId",
            u."fullName",
            MAX(b."createdAt")            as last_booking,
            COUNT(b.id)                   as frequency,
            COALESCE(SUM(b."priceAtBooking"), 0) as monetary
        FROM "Booking" b
        JOIN "User" u ON u.id = b."patientId"
        WHERE b.status IN ('CONFIRMED', 'COMPLETED')
        GROUP BY b."patientId", u."fullName"
    """)

    if len(df) < 3:
        return {"segments": [], "summary": {}}

    now = pd.Timestamp.now(tz='UTC')
    df["last_booking"] = pd.to_datetime(df["last_booking"], utc=True)
    df["recency"]  = (now - df["last_booking"]).dt.days
    df["frequency"] = df["frequency"].astype(float)
    df["monetary"]  = df["monetary"].astype(float)

    # Normalize
    scaler   = StandardScaler()
    features = scaler.fit_transform(df[["recency", "frequency", "monetary"]])

    # K-Means clustering (4 segments)
    k      = min(4, len(df))
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    df["cluster"] = kmeans.fit_predict(features)

    # Label segments based on centroids
    centers = pd.DataFrame(
        scaler.inverse_transform(kmeans.cluster_centers_),
        columns=["recency", "frequency", "monetary"]
    )

    segment_labels = {}
    for i, row in centers.iterrows():
        if row["recency"] < 14 and row["frequency"] >= 3:
            segment_labels[i] = "Champions"
        elif row["recency"] < 30 and row["frequency"] >= 2:
            segment_labels[i] = "Loyal Patients"
        elif row["recency"] > 60:
            segment_labels[i] = "At Risk"
        else:
            segment_labels[i] = "New Patients"

    df["segment"] = df["cluster"].map(segment_labels)

    summary = df.groupby("segment").agg(
        count=("patientId", "count"),
        avg_recency=("recency", "mean"),
        avg_frequency=("frequency", "mean"),
        avg_monetary=("monetary", "mean"),
    ).round(2).reset_index()

    return {
        "segments":     summary.to_dict(orient="records"),
        "patientList":  df[["fullName", "recency", "frequency", "monetary", "segment"]].to_dict(orient="records"),
        "totalAnalyzed": len(df),
    }