import type { FilterQuery, SortOrder } from 'mongoose';
import { isMongoConnected } from '../../shared/db.js';
import { computeStatus } from '../../shared/inventoryStatus.js';
import { addInventory, listInventory } from '../../shared/store.js';
import type { InventoryItem } from '../../shared/types.js';
import { InventoryModel } from './model.js';

export type ListOptions = {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  status?: string;
  expiryBefore?: string;
  sort?: string;
};

function parseSort(sort?: string) {
  const raw = sort || 'expiryDate';
  const direction: SortOrder = raw.startsWith('-') ? -1 : 1;
  const field = raw.replace('-', '');

  if (!['expiryDate', 'quantity', 'name', 'createdAt'].includes(field)) {
    return { expiryDate: 1 };
  }

  return { [field]: direction };
}

function mapDoc(doc: any): InventoryItem {
  return {
    id: doc._id.toString(),
    name: doc.name,
    category: doc.category,
    quantity: doc.quantity,
    unit: doc.unit,
    expiryDate: new Date(doc.expiryDate).toISOString(),
    supplier: doc.supplier,
    status: doc.status,
    minStock: doc.minStock ?? 0,
    location: doc.location,
    costPerUnit: doc.costPerUnit,
    tags: doc.tags || [],
  };
}

function filterMemory(items: InventoryItem[], options: ListOptions) {
  const { search, category, status, expiryBefore } = options;
  const query = search?.toLowerCase().trim();
  const expiryCutoff = expiryBefore ? new Date(expiryBefore).getTime() : null;

  return items.filter((item) => {
    if (category && category !== 'all' && item.category !== category) {
      return false;
    }
    if (status && status !== 'all' && item.status !== status) {
      return false;
    }
    if (query) {
      const haystack = `${item.name} ${item.supplier} ${item.category}`.toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }
    if (expiryCutoff && new Date(item.expiryDate).getTime() > expiryCutoff) {
      return false;
    }
    return true;
  });
}

export async function listInventoryItems(options: ListOptions) {
  const page = Math.max(1, options.page);
  const limit = Math.min(Math.max(1, options.limit), 100);

  if (!isMongoConnected()) {
    const allItems = filterMemory(listInventory(), options);
    const total = allItems.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    return {
      items: allItems.slice(start, start + limit),
      page,
      limit,
      total,
      totalPages,
      source: 'memory',
    };
  }

  const filter: FilterQuery<typeof InventoryModel> = {};
  if (options.category && options.category !== 'all') {
    filter.category = options.category;
  }
  if (options.status && options.status !== 'all') {
    filter.status = options.status;
  }
  if (options.expiryBefore) {
    filter.expiryDate = { $lte: new Date(options.expiryBefore) };
  }
  if (options.search) {
    const regex = new RegExp(options.search, 'i');
    filter.$or = [{ name: regex }, { supplier: regex }, { category: regex }];
  }

  const [items, total] = await Promise.all([
    InventoryModel.find(filter)
      .sort(parseSort(options.sort))
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    InventoryModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    items: items.map(mapDoc),
    page,
    limit,
    total,
    totalPages,
    source: 'mongo',
  };
}

export async function createInventoryItem(data: InventoryItem) {
  const expiry = new Date(data.expiryDate);
  const status = computeStatus(expiry, data.quantity, data.minStock);

  if (!isMongoConnected()) {
    const item = {
      ...data,
      id: `inv_${Date.now()}`,
      status,
    };
    addInventory(item);
    return item;
  }

  const created = await InventoryModel.create({
    ...data,
    expiryDate: expiry,
    status,
  });

  return mapDoc(created);
}
