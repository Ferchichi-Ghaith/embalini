import prisma from "@/lib/prisma";

export const produitServices = {
  // Fetch all products including their category details
  getAll: async () => {
    return await prisma.product.findMany({
      include: {
        category: true, // Returns the full Category object
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  // Fetch a single product by ID with category info
  getById: async (id: string) => {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      }
    });
  },

  // Create a new product
  create: async (data: {
    title: string;
    price: number;
    image: string;
    description: string;
    specs: any;
    categoryId: string; // Required for the relation
    etat?: string;      // From your API "etat" field
  }) => {
    return await prisma.product.create({
      data: {
        title: data.title,
        price: data.price,
        image: data.image,
        description: data.description,
        etat: data.etat,
        specs: data.specs || [],
        // Connect the product to an existing category
        category: {
          connect: { id: data.categoryId }
        }
      },
      include: {
        category: true
      }
    });
  },

  // Update a product
  update: async (id: string, data: any) => {
    // If updating the category, we use the 'connect' syntax
    const { categoryId, ...rest } = data;
    
    return await prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(categoryId && {
          category: {
            connect: { id: categoryId }
          }
        })
      },
      include: {
        category: true
      }
    });
  },

  // Delete a product
  delete: async (id: string) => {
    return await prisma.product.delete({
      where: { id }
    });
  },

  // NEW: Fetch products filtered by category
  getByCategory: async (categoryId: string) => {
    return await prisma.product.findMany({
      where: { categoryId },
      include: { category: true }
    });
  }
};