import { Injectable } from '@nestjs/common';

@Injectable()
export class HomeVisitService {

  // ── Haversine formula — distance between two GPS points ────────
  calculateDistance(
    lat1: number, lon1: number,
    lat2: number, lon2: number,
  ): number {
    const R    = 6371; // Earth radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // km, 1 decimal
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // ── Dynamic travel fee based on distance ──────────────────────
  // Doha, Qatar pricing (QAR)
  calculateTravelFee(distanceKm: number): number {
    if (distanceKm <= 2)  return 20;   // within 2 km — minimal fee
    if (distanceKm <= 5)  return 40;   // 2–5 km
    if (distanceKm <= 10) return 60;   // 5–10 km
    if (distanceKm <= 20) return 80;   // 10–20 km
    if (distanceKm <= 35) return 100;  // 10–35 km
    return 120;                        // >35 km — max fee
  }

  // ── Estimate fee before booking ────────────────────────────────
  estimateFee(
    patientLat: number,
    patientLon: number,
    centerLat:  number,
    centerLon:  number,
  ): { distanceKm: number; travelFee: number; breakdown: string } {
    const dist = this.calculateDistance(
      patientLat, patientLon,
      centerLat,  centerLon,
    );
    const fee = this.calculateTravelFee(dist);

    return {
      distanceKm: dist,
      travelFee:  fee,
      breakdown:  `${dist} km from center — QAR ${fee} travel fee`,
    };
  }
}