import prisma from "@/lib/prisma";

export const categoryServices = {
  // Get all categories for the dropdowns
  getAll: async () => {
    return await prisma.category.findMany({
      orderBy: { title: 'asc' }
    });
  },

  // Get a single category (useful for a detail page)
  getById: async (id: string) => {
    return await prisma.category.findUnique({
      where: { id },
      include: { products: true } // Optionally include products in this category
    });
  },

  // Create a new category (title and image)
  create: async (data: { title: string; image: string }) => {
    return await prisma.category.create({
      data
    });
  },

  // Update category details
  update: async (id: string, data: Partial<{ title: string; image: string }>) => {
    return await prisma.category.update({
      where: { id },
      data
    });
  },

  // Delete a category
  delete: async (id: string) => {
    return await prisma.category.delete({
      where: { id }
    });
  }
};