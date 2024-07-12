import type { Category } from "@prisma/client";

export type CategoryDTO = {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export abstract class CategoryDTOMapper {
  public static fromCategory(category: Category): CategoryDTO {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  public static fromCategories(categories: Category[]): CategoryDTO[] {
    return categories.map(this.fromCategory);
  }
}
