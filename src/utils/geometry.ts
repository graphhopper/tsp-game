export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
}

export const calculateTotalDistance = (points: { lat: number, lng: number }[], pathIndices: number[]): number => {
    let total = 0;
    for (let i = 0; i < pathIndices.length - 1; i++) {
        const p1 = points[pathIndices[i]];
        const p2 = points[pathIndices[i + 1]];
        total += calculateDistance(p1.lat, p1.lng, p2.lat, p2.lng);
    }
    return total;
}
