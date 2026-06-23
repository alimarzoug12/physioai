# analytics/forecasting.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from .db import query


def forecast_bookings_arima(days_ahead: int = 7) -> list:
    """
    Forecast next N days of bookings using ARIMA.
    Falls back to moving average if statsmodels not available.
    """
    df = query("""
        SELECT DATE("createdAt") as ds, COUNT(*) as y
        FROM "Booking"
        WHERE "createdAt" >= CURRENT_DATE - INTERVAL '90 days'
        GROUP BY DATE("createdAt")
        ORDER BY ds
    """)

    if len(df) < 14:
        # Not enough data — use moving average
        avg = df["y"].mean() if len(df) > 0 else 5
        result = []
        for i in range(1, days_ahead + 1):
            date = (datetime.now() + timedelta(days=i)).date()
            result.append({
                "date":     str(date),
                "forecast": round(float(avg), 1),
                "method":   "moving_average",
            })
        return result

    try:
        from statsmodels.tsa.arima.model import ARIMA

        model = ARIMA(df["y"].values, order=(2, 1, 2))
        fit   = model.fit()
        preds = fit.forecast(steps=days_ahead)

        result = []
        for i, pred in enumerate(preds):
            date = (datetime.now() + timedelta(days=i + 1)).date()
            result.append({
                "date":     str(date),
                "forecast": max(0, round(float(pred), 1)),
                "method":   "ARIMA",
            })
        return result

    except Exception as e:
        print(f"ARIMA failed: {e} — using moving average")
        window = df["y"].rolling(7).mean().iloc[-1]
        result = []
        for i in range(1, days_ahead + 1):
            date = (datetime.now() + timedelta(days=i)).date()
            result.append({
                "date":     str(date),
                "forecast": round(float(window), 1),
                "method":   "moving_average_fallback",
            })
        return result


def forecast_revenue(days_ahead: int = 7) -> list:
    """Forecast revenue using linear regression on trend."""
    from sklearn.linear_model import LinearRegression

    df = query("""
        SELECT DATE("createdAt") as ds, COALESCE(SUM("priceAtBooking"), 0) as revenue
        FROM "Booking"
        WHERE status IN ('CONFIRMED', 'COMPLETED')
          AND "createdAt" >= CURRENT_DATE - INTERVAL '60 days'
        GROUP BY DATE("createdAt")
        ORDER BY ds
    """)

    if len(df) < 7:
        avg_revenue = df["revenue"].mean() if len(df) > 0 else 500
        result = []
        for i in range(1, days_ahead + 1):
            date = (datetime.now() + timedelta(days=i)).date()
            result.append({"date": str(date), "forecast": round(float(avg_revenue), 2)})
        return result

    X = np.arange(len(df)).reshape(-1, 1)
    y = df["revenue"].values

    model = LinearRegression()
    model.fit(X, y)

    result = []
    for i in range(1, days_ahead + 1):
        x_new = np.array([[len(df) + i]])
        pred  = model.predict(x_new)[0]
        date  = (datetime.now() + timedelta(days=i)).date()
        result.append({
            "date":     str(date),
            "forecast": max(0, round(float(pred), 2)),
        })
    return result