export function computeStatus(expiryDate: Date, quantity: number, minStock = 0) {
  const msLeft = expiryDate.getTime() - Date.now();
  const daysLeft = Math.floor(msLeft / 86400000);

  if (quantity <= minStock || daysLeft <= 2) {
    return 'critical' as const;
  }

  if (daysLeft <= 5) {
    return 'warning' as const;
  }

  return 'stable' as const;
}
