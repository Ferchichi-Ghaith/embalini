import { Elysia, t } from "elysia";
import { BlogServices } from "./blog.service";

export const BlogsController = new Elysia({
  prefix: "/blog",
})
  // GET /blog
  .get("/", async ({ set }) => {
    try {
      const blogs = await BlogServices.getAll();
      return blogs;
    } catch (e) {
      set.status = 500;
      return { error: "Failed to fetch blogs" };
    }
  })
  // 1. CREATE /blog
  .post("/", async ({ body, set }) => {
    try {
      const newPost = await BlogServices.create(body);
      set.status = 201; // Created
      return newPost;
    } catch (e) {
      set.status = 500;
      return { error: "Failed to create blog post" };
    }
  }, {
    body: t.Object({
      title: t.String({ minLength: 3 }),
      etat: t.Union([t.Literal('new'), t.Literal('used')], { 
        default: 'new',
        description: "Must be 'new' or 'used'" 
      }),
      date: t.String({ example: "MAR 2026" }),
      readTime: t.String(),
      image: t.String(),
      content: t.String()
    }),
    detail: { tags: ['blog'], summary: 'Create a new blog post' }
  })

  // GET /blog/:id
  .get("/:id", async ({ params: { id }, set }) => {
    try {
      const post = await BlogServices.getById(id);
      if (!post) {
        set.status = 404;
        return { error: "Post not found" };
      }
      return post;
    } catch (e) {
      set.status = 500;
      return { error: "Failed to fetch post" };
    }
  })

  // PATCH /blog/:id
  .patch("/:id", async ({ params: { id }, body, set }) => {
    try {
      const updatedPost = await BlogServices.update(id, body);
      if (!updatedPost) {
        set.status = 404;
        return { error: "Post not found or update failed" };
      }
      return updatedPost;
    } catch (e) {
      set.status = 500;
      return { error: "Internal server error" };
    }
  }, {
    body: t.Object({
      title: t.Optional(t.String()),
      etat: t.Optional(t.String()),
      date: t.Optional(t.String()), // e.g., "MAR 2026"
      readTime: t.Optional(t.String()),
      image: t.Optional(t.String()),
      content: t.Optional(t.String())
    })
  })

  // DELETE /blog/:id
  .delete("/:id", async ({ params: { id }, set }) => {
    try {
      const deleted = await BlogServices.delete(id);
      if (!deleted) {
        set.status = 404;
        return { error: "Post not found" };
      }
      return { message: "Post deleted successfully" };
    } catch (e) {
      set.status = 500;
      return { error: "Failed to delete post" };
    }
  });
