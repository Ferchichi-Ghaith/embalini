import prisma from "@/lib/prisma";


export const commandServices = {
  // Fetch all commandss with their items
  getAll: async () => {
    return await prisma.commands.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });
  },

  // Create command with nested items
  create: async (data: any) => {
    const { items, ...orderData } = data;
    return await prisma.commands.create({
      data: {
        ...orderData,
        items: {
          create: items // Prisma handles the linking automatically
        }
      },
      include: { items: true }
    });
  },

  // Fetch a single commands with its items
  getBySecret: async (secret_code: string) => {
    return await prisma.commands.findUnique({
      where: { 
        secret_code: secret_code 
      },
      include: { 
        items: true,
      }
    });
  },

  // Update commands status or details
  update: async (id: string, data: any) => {
    return await prisma.commands.update({
      where: { id },
      data,
      include: { items: true }
    });
  },

  // Delete commands (Cascade will handle commandsItems)
  delete: async (id: string) => {
    return await prisma.commands.delete({
      where: { id }
    });
  }
};

