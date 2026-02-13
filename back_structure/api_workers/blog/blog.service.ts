import prisma from "@/lib/prisma";


export const BlogServices = {
// Create a new post
create: async (data: { 
  title: string; 
  etat: string; // "new" or "used"
  date: string; // e.g., "MAR 2026"
  readTime: string; 
  image: string; 
  content: string; 
}) => {
  return await prisma.blogPost.create({
    data: {
      ...data,
      // Ensure etat is lowercase if your logic depends on it
      etat: data.etat.toLowerCase(), 
    }
  });
},
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