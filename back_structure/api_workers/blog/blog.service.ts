import prisma from "@/lib/prisma";


export const BlogServices = {
  // Fetch all posts, newest first
  getAll: async () => {
    return await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  // Fetch a single post
  getById: async (id: string) => {
    return await prisma.blogPost.findUnique({
      where: { id }
    });
  },

  // Update a post (Patch)
  update: async (id: string, data: any) => {
    return await prisma.blogPost.update({
      where: { id },
      data: data
    });
  },

  // Delete a post
  delete: async (id: string) => {
    return await prisma.blogPost.delete({
      where: { id }
    });
  }
};