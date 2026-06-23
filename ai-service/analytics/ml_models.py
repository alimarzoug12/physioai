# analytics/ml_models.py
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from .db import query


def train_noshow_model():
    """
    Predict if a patient will no-show based on:
    - Hour of booking
    - Days in advance booked
    - Patient's past cancellation rate
    - Session type (CLINIC vs HOME)
    - Payment method
    """
    df = query("""
        SELECT
            b.id,
            b.status,
            b."sessionType",
            b."bookedVia",
            EXTRACT(HOUR FROM b."createdAt")  as booking_hour,
            EXTRACT(DOW  FROM b."createdAt")  as booking_dow,
            EXTRACT(DAY  FROM (s.date - b."createdAt"::date)) as days_in_advance,
            (
                SELECT COUNT(*) FROM "Booking" b2
                WHERE b2."patientId" = b."patientId"
                  AND b2.status = 'CANCELLED'
                  AND b2."createdAt" < b."createdAt"
            ) as past_cancellations,
            (
                SELECT COUNT(*) FROM "Booking" b3
                WHERE b3."patientId" = b."patientId"
                  AND b3."createdAt" < b."createdAt"
            ) as total_past_bookings
        FROM "Booking" b
        JOIN "Slot" s ON s.id = b."slotId"
        WHERE b.status IN ('COMPLETED', 'CANCELLED')
    """)

    if len(df) < 20:
        return {"error": "Not enough data to train model (need 20+ completed bookings)"}

    # Target: 1 = cancelled (no-show), 0 = completed
    df["target"] = (df["status"] == "CANCELLED").astype(int)
    df["sessionType_enc"] = (df["sessionType"] == "HOME").astype(int)
    df["ai_booked"]       = (df["bookedVia"] == "AI_AGENT").astype(int)
    df["cancellation_rate"] = df["past_cancellations"] / (df["total_past_bookings"] + 1)

    features = [
        "booking_hour", "booking_dow", "days_in_advance",
        "cancellation_rate", "sessionType_enc", "ai_booked"
    ]

    df = df.dropna(subset=features)
    X  = df[features].values
    y  = df["target"].values

    if len(X) < 10:
        return {"error": "Not enough complete data after cleaning"}

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test  = scaler.transform(X_test)

    model = LogisticRegression(random_state=42)
    model.fit(X_train, y_train)

    accuracy = accuracy_score(y_test, model.predict(X_test))

    # Feature importance
    importance = dict(zip(features, np.abs(model.coef_[0])))

    return {
        "modelType":        "LogisticRegression",
        "accuracy":         round(accuracy * 100, 2),
        "featuresUsed":     features,
        "featureImportance": {k: round(float(v), 4) for k, v in sorted(importance.items(), key=lambda x: -x[1])},
        "trainSamples":     len(X_train),
        "testSamples":      len(X_test),
    }


def get_anomalies() -> list:
    """Detect unusual booking patterns using IsolationForest."""
    from sklearn.ensemble import IsolationForest

    df = query("""
        SELECT
            DATE("createdAt") as date,
            COUNT(*) as bookings,
            COALESCE(SUM("priceAtBooking"), 0) as revenue
        FROM "Booking"
        GROUP BY DATE("createdAt")
        ORDER BY date
    """)

    if len(df) < 14:
        return []

    X = df[["bookings", "revenue"]].values
    model = IsolationForest(contamination=0.1, random_state=42)
    df["anomaly"] = model.fit_predict(X)

    anomalies = df[df["anomaly"] == -1].copy()
    anomalies["date"] = anomalies["date"].astype(str)

    return anomalies[["date", "bookings", "revenue"]].to_dict(orient="records")