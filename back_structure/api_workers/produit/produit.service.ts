import prisma from "@/lib/prisma";


export const produitServices = {
  // Fetch all products
  getAll: async () => {
    return await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  // Fetch a single product by ID
  getById: async (id: string) => {
    return await prisma.product.findUnique({
      where: { id }
    });
  },

  // Create a new product (handles the JSON specs field)
  create: async (data: any) => {
    return await prisma.product.create({
      data: {
        ...data,
        // Ensure specs is handled correctly if passed as object/array
        specs: data.specs || [] 
      }
    });
  },

  // Update a product
  update: async (id: string, data: any) => {
    return await prisma.product.update({
      where: { id },
      data
    });
  },

  // Delete a product
  delete: async (id: string) => {
    return await prisma.product.delete({
      where: { id }
    });
  }

};