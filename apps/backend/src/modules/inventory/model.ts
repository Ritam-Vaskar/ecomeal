import mongoose, { Schema } from 'mongoose';

const InventorySchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    expiryDate: { type: Date, required: true, index: true },
    supplier: { type: String, required: true, index: true },
    status: { type: String, required: true, index: true },
    minStock: { type: Number, default: 0 },
    location: { type: String },
    costPerUnit: { type: Number },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
);

InventorySchema.index({ expiryDate: 1, status: 1 });

export const InventoryModel =
  mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema);
