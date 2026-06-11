export function computeStatus(expiryDate, quantity, minStock = 0) {
    const msLeft = expiryDate.getTime() - Date.now();
    const daysLeft = Math.floor(msLeft / 86400000);
    if (quantity <= minStock || daysLeft <= 2) {
        return 'critical';
    }
    if (daysLeft <= 5) {
        return 'warning';
    }
    return 'stable';
}
