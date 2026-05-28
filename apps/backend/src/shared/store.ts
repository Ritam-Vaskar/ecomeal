import type { InventoryItem } from './types.js';

const inventory: InventoryItem[] = [
  {
    id: 'inv_1',
    name: 'Mushrooms',
    category: 'Produce',
    quantity: 12,
    unit: 'kg',
    expiryDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    supplier: 'North Farm',
    status: 'critical',
  },
  {
    id: 'inv_2',
    name: 'Paneer',
    category: 'Dairy',
    quantity: 6,
    unit: 'kg',
    expiryDate: new Date(Date.now() + 4 * 86400000).toISOString(),
    supplier: 'Lakeside Co-op',
    status: 'warning',
  },
  {
    id: 'inv_3',
    name: 'Spinach',
    category: 'Produce',
    quantity: 18,
    unit: 'kg',
    expiryDate: new Date(Date.now() + 6 * 86400000).toISOString(),
    supplier: 'Green Leaf',
    status: 'stable',
  },
];

export function listInventory() {
  return inventory;
}

export function addInventory(item: InventoryItem) {
  inventory.push(item);
}
