import { v4 as uuidv4 } from 'uuid';

export interface Category {
  id: string;
  userId: string;
  name: string;
  icon?: string;
  color?: string;
  type: 'income' | 'expense';
  createdAt: Date;
}

export class CategoryModel {
  private categories: Category[] = [];

  constructor() {
    this.categories = [];
  }

  public create(userId: string, name: string, icon?: string, color?: string, type: 'income' | 'expense'): Category {
    const newCategory: Category = {
      id: uuidv4(),
      userId,
      name,
      icon,
      color,
      type,
      createdAt: new Date(),
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  public findAll(): Category[] {
    return this.categories;
  }

  public findById(id: string): Category | undefined {
    return this.categories.find(category => category.id === id);
  }

  public update(id: string, updatedData: Partial<Category>): Category | undefined {
    const category = this.findById(id);
    if (category) {
      Object.assign(category, updatedData);
      return category;
    }
    return undefined;
  }

  public delete(id: string): boolean {
    const index = this.categories.findIndex(category => category.id === id);
    if (index !== -1) {
      this.categories.splice(index, 1);
      return true;
    }
    return false;
  }
}