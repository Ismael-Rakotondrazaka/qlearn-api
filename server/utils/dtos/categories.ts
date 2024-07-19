import type { Category } from "@prisma/client";

export type CategoryDTO = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    quizzes: number;
  };
};

export abstract class CategoryDTOMapper {
  public static fromCategory(
    category: Category & {
      _count: {
        quizzes: number;
      };
    },
  ): CategoryDTO {
    return {
      id: category.id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      _count: {
        quizzes: category._count.quizzes,
      },
    };
  }

  public static fromCategories(
    categories: (Category & {
      _count: {
        quizzes: number;
      };
    })[],
  ): CategoryDTO[] {
    return categories.map(this.fromCategory);
  }
}
