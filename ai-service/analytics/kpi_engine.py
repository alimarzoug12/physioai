# analytics/kpi_engine.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from .db import query, scalar


def safe_pct(a: float, b: float) -> float:
    """Safe percentage calculation."""
    return round((a / b * 100), 2) if b > 0 else 0.0


def safe_growth(current: float, previous: float) -> float:
    """Growth rate between two periods."""
    if previous == 0:
        return 100.0 if current > 0 else 0.0
    return round((current - previous) / previous * 100, 2)


# ── Business KPIs ─────────────────────────────────────────────

def get_revenue_kpis() -> dict:
    now = datetime.now()
    first_this_month  = now.replace(day=1, hour=0, minute=0, second=0)
    first_last_month  = (first_this_month - timedelta(days=1)).replace(day=1)
    first_last_month2 = (first_last_month - timedelta(days=1)).replace(day=1)

    total_revenue = scalar("""
        SELECT COALESCE(SUM(b."priceAtBooking"), 0)
        FROM "Booking" b
        WHERE b.status = 'CONFIRMED' OR b.status = 'COMPLETED'
    """)

    mrr = scalar("""
        SELECT COALESCE(SUM(b."priceAtBooking"), 0)
        FROM "Booking" b
        WHERE (b.status = 'CONFIRMED' OR b.status = 'COMPLETED')
          AND b."createdAt" >= :start
    """, {"start": first_this_month})

    last_mrr = scalar("""
        SELECT COALESCE(SUM(b."priceAtBooking"), 0)
        FROM "Booking" b
        WHERE (b.status = 'CONFIRMED' OR b.status = 'COMPLETED')
          AND b."createdAt" >= :start AND b."createdAt" < :end
    """, {"start": first_last_month, "end": first_this_month})

    avg_session_value = scalar("""
        SELECT COALESCE(AVG(b."priceAtBooking"), 0)
        FROM "Booking" b
        WHERE b.status = 'CONFIRMED' OR b.status = 'COMPLETED'
    """)

    return {
        "totalRevenue":     round(float(total_revenue), 2),
        "mrr":              round(float(mrr), 2),
        "mrrGrowth":        safe_growth(float(mrr), float(last_mrr)),
        "avgSessionValue":  round(float(avg_session_value), 2),
    }


def get_booking_kpis() -> dict:
    df = query("""
        SELECT status, COUNT(*) as count
        FROM "Booking"
        GROUP BY status
    """)

    counts = df.set_index("status")["count"].to_dict()
    total      = sum(counts.values())
    confirmed  = counts.get("CONFIRMED", 0) + counts.get("COMPLETED", 0)
    cancelled  = counts.get("CANCELLED", 0)
    pending    = counts.get("PENDING", 0)
    completed  = counts.get("COMPLETED", 0)

    # Today
    today_total = scalar("""
        SELECT COUNT(*) FROM "Booking"
        WHERE DATE("createdAt") = CURRENT_DATE
    """)

    today_confirmed = scalar("""
        SELECT COUNT(*) FROM "Booking"
        WHERE DATE("createdAt") = CURRENT_DATE
          AND status IN ('CONFIRMED', 'COMPLETED')
    """)

    return {
        "totalBookings":    int(total),
        "confirmedBookings":int(confirmed),
        "cancelledBookings":int(cancelled),
        "pendingBookings":  int(pending),
        "completedSessions":int(completed),
        "bookingRate":      safe_pct(confirmed, total),
        "cancellationRate": safe_pct(cancelled, total),
        "todayBookings":    int(today_total),
        "todayConfirmed":   int(today_confirmed),
    }


def get_patient_kpis() -> dict:
    total_patients = scalar("""
        SELECT COUNT(*) FROM "User" WHERE role = 'PATIENT'
    """)

    new_this_month = scalar("""
        SELECT COUNT(*) FROM "User"
        WHERE role = 'PATIENT'
          AND "createdAt" >= DATE_TRUNC('month', CURRENT_DATE)
    """)

    new_last_month = scalar("""
        SELECT COUNT(*) FROM "User"
        WHERE role = 'PATIENT'
          AND "createdAt" >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
          AND "createdAt" < DATE_TRUNC('month', CURRENT_DATE)
    """)

    # Retention: patients with 2+ bookings
    retained = scalar("""
        SELECT COUNT(*) FROM (
            SELECT "patientId"
            FROM "Booking"
            WHERE status IN ('CONFIRMED', 'COMPLETED')
            GROUP BY "patientId"
            HAVING COUNT(*) >= 2
        ) r
    """)

    # Avg sessions per patient
    avg_sessions = scalar("""
        SELECT COALESCE(AVG(cnt), 0) FROM (
            SELECT "patientId", COUNT(*) as cnt
            FROM "Booking"
            WHERE status IN ('CONFIRMED', 'COMPLETED')
            GROUP BY "patientId"
        ) s
    """)

    # Churn: no booking in last 30 days
    churned = scalar("""
        SELECT COUNT(DISTINCT u.id)
        FROM "User" u
        WHERE u.role = 'PATIENT'
          AND u.id NOT IN (
              SELECT DISTINCT "patientId" FROM "Booking"
              WHERE "createdAt" >= NOW() - INTERVAL '30 days'
          )
          AND u."createdAt" < NOW() - INTERVAL '30 days'
    """)

    # Patient Lifetime Value
    plv = scalar("""
        SELECT COALESCE(SUM(b."priceAtBooking") / NULLIF(COUNT(DISTINCT b."patientId"), 0), 0)
        FROM "Booking" b
        WHERE b.status IN ('CONFIRMED', 'COMPLETED')
    """)

    return {
        "totalPatients":        int(total_patients),
        "newPatientsThisMonth": int(new_this_month),
        "newPatientsGrowth":    safe_growth(float(new_this_month), float(new_last_month)),
        "retentionRate":        safe_pct(float(retained), float(total_patients)),
        "avgSessionsPerPatient":round(float(avg_sessions), 2),
        "churnRate":            safe_pct(float(churned), float(total_patients)),
        "patientLifetimeValue": round(float(plv), 2),
    }


def get_doctor_kpis() -> dict:
    total_doctors = scalar('SELECT COUNT(*) FROM "Doctor"')
    available     = scalar('SELECT COUNT(*) FROM "Doctor" WHERE "isAvailable" = true')

    avg_rating = scalar("""
        SELECT COALESCE(AVG(rating), 0) FROM "Doctor"
    """)

    # Utilization: booked slots / total future slots
    total_slots  = scalar('SELECT COUNT(*) FROM "Slot" WHERE date >= CURRENT_DATE')
    booked_slots = scalar('SELECT COUNT(*) FROM "Slot" WHERE date >= CURRENT_DATE AND "isBooked" = true')

    # Top doctor by bookings
    top = query("""
        SELECT u."fullName", COUNT(b.id) as bookings
        FROM "Booking" b
        JOIN "Doctor" d ON d.id = b."doctorId"
        JOIN "User"   u ON u.id = d."userId"
        WHERE b.status IN ('CONFIRMED', 'COMPLETED')
        GROUP BY u."fullName"
        ORDER BY bookings DESC
        LIMIT 5
    """)

    return {
        "totalDoctors":      int(total_doctors),
        "availableDoctors":  int(available),
        "avgDoctorRating":   round(float(avg_rating), 2),
        "slotUtilization":   safe_pct(float(booked_slots), float(total_slots)),
        "topDoctors":        top.to_dict(orient="records"),
    }


def get_ai_kpis() -> dict:
    total_sessions = scalar('SELECT COUNT(*) FROM "ChatSession"')
    total_messages = scalar('SELECT COUNT(*) FROM "ChatMessage"')

    ai_bookings = scalar("""
        SELECT COUNT(*) FROM "Booking"
        WHERE "bookedVia" = 'AI_AGENT'
    """)

    total_bookings = scalar('SELECT COUNT(*) FROM "Booking"')

    avg_messages = scalar("""
        SELECT COALESCE(AVG(cnt), 0) FROM (
            SELECT "sessionId", COUNT(*) as cnt
            FROM "ChatMessage"
            GROUP BY "sessionId"
        ) m
    """)

    # Top specialties extracted from AI
    top_specialties = query("""
        SELECT
            SUBSTRING(content FROM 'specialty[^:]*:[^"]*"([^"]+)"') as specialty,
            COUNT(*) as count
        FROM "ChatMessage"
        WHERE role = 'ASSISTANT'
          AND content LIKE '%specialty%'
        GROUP BY 1
        ORDER BY count DESC
        LIMIT 5
    """)

    return {
        "totalChatSessions":    int(total_sessions),
        "totalMessages":        int(total_messages),
        "aiBookings":           int(ai_bookings),
        "aiConversionRate":     safe_pct(float(ai_bookings), float(total_sessions)),
        "avgMessagesPerSession":round(float(avg_messages), 2),
        "aiVsManualBookings": {
            "ai":     int(ai_bookings),
            "manual": int(total_bookings) - int(ai_bookings),
        },
    }


def get_revenue_trend(days: int = 30) -> list:
    """Daily revenue for the last N days."""
    df = query("""
        SELECT
            DATE("createdAt") as date,
            COALESCE(SUM("priceAtBooking"), 0) as revenue,
            COUNT(*) as bookings
        FROM "Booking"
        WHERE status IN ('CONFIRMED', 'COMPLETED')
          AND "createdAt" >= CURRENT_DATE - :days * INTERVAL '1 day'
        GROUP BY DATE("createdAt")
        ORDER BY date
    """, {"days": days})
    df["date"] = df["date"].astype(str)
    return df.to_dict(orient="records")


def get_bookings_by_specialty() -> list:
    df = query("""
        SELECT
            d.specialties[1] as specialty,
            COUNT(b.id) as bookings,
            COALESCE(SUM(b."priceAtBooking"), 0) as revenue
        FROM "Booking" b
        JOIN "Doctor" d ON d.id = b."doctorId"
        WHERE b.status IN ('CONFIRMED', 'COMPLETED')
        GROUP BY specialty
        ORDER BY bookings DESC
    """)
    return df.to_dict(orient="records")


def get_hourly_distribution() -> list:
    """When do patients book? Heatmap data."""
    df = query("""
        SELECT
            EXTRACT(DOW  FROM "createdAt") as day_of_week,
            EXTRACT(HOUR FROM "createdAt") as hour,
            COUNT(*) as bookings
        FROM "Booking"
        GROUP BY day_of_week, hour
        ORDER BY day_of_week, hour
    """)
    return df.to_dict(orient="records")


def get_all_kpis() -> dict:
    """Return all KPIs in one call."""
    return {
        "revenue":        get_revenue_kpis(),
        "bookings":       get_booking_kpis(),
        "patients":       get_patient_kpis(),
        "doctors":        get_doctor_kpis(),
        "ai":             get_ai_kpis(),
        "revenueTrend":   get_revenue_trend(30),
        "bySpecialty":    get_bookings_by_specialty(),
        "hourlyPattern":  get_hourly_distribution(),
        "generatedAt":    datetime.now().isoformat(),
    }