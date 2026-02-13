import prisma from "@/lib/prisma";


export const commandServices = {
  // Fetch all commandss with their items
  getAll: async () => {
    return await prisma.commands.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });
  },

  // Fetch a single commands with its items
  getById: async (id: string) => {
    return await prisma.commands.findUnique({
      where: { id },
      include: { items: true }
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

