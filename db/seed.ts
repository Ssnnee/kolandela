import { db } from './index';
import { categories } from './schema';

const DEFAULT_CATEGORIES = [
  // EXPENSE
  { name: 'Food', color: 'rgb(255,121,102)', icon: 'fast-food-outline', type: 'EXPENSE' as const, isDefault: true },
  { name: 'Transport', color: 'rgb(173,123,255)', icon: 'car-outline', type: 'EXPENSE' as const, isDefault: true },
  { name: 'Housing', color: 'rgb(0,250,217)', icon: 'home-outline', type: 'EXPENSE' as const, isDefault: true },
  { name: 'Health', color: 'rgb(255,59,48)', icon: 'medkit-outline', type: 'EXPENSE' as const, isDefault: true },
  { name: 'Entertainment', color: 'rgb(255,196,0)', icon: 'game-controller-outline', type: 'EXPENSE' as const, isDefault: true },
  { name: 'Shopping', color: 'rgb(201,168,255)', icon: 'bag-outline', type: 'EXPENSE' as const, isDefault: true },
  { name: 'Education', color: 'rgb(100,210,255)', icon: 'school-outline', type: 'EXPENSE' as const, isDefault: true },
  { name: 'Other', color: 'rgb(131,131,156)', icon: 'ellipsis-horizontal-outline', type: 'EXPENSE' as const, isDefault: true },
  // INCOME
  { name: 'Salary', color: 'rgb(255,121,102)', icon: 'briefcase-outline', type: 'INCOME' as const, isDefault: true },
  { name: 'Freelance', color: 'rgb(0,250,217)', icon: 'laptop-outline', type: 'INCOME' as const, isDefault: true },
  { name: 'Investment', color: 'rgb(173,123,255)', icon: 'trending-up-outline', type: 'INCOME' as const, isDefault: true },
  { name: 'Gift', color: 'rgb(255,196,0)', icon: 'gift-outline', type: 'INCOME' as const, isDefault: true },
  { name: 'Other', color: 'rgb(131,131,156)', icon: 'ellipsis-horizontal-outline', type: 'INCOME' as const, isDefault: true },
];

export async function seedDatabase() {
  try {
    for (const cat of DEFAULT_CATEGORIES) {
      await db.insert(categories).values(cat).onConflictDoUpdate({
        target: [categories.name, categories.type],
        set: { isDeleted: false, deletedAt: null },
      });
    }
  } catch (error) {
    console.error('Seed error:', error);
  }
}
