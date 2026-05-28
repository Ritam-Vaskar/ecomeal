export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  supplier: string;
  status: 'stable' | 'warning' | 'critical';
  minStock?: number;
  location?: string;
  costPerUnit?: number;
  tags?: string[];
};

export type ChefSpecial = {
  title: string;
  description: string;
  ingredients: string[];
  priority: string;
};

export type UserRole = 'admin' | 'manager' | 'staff';
