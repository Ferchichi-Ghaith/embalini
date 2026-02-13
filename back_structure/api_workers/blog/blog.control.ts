import { Elysia, t } from "elysia";
import { BlogServices } from "./blog.service";

export const BlogsController = new Elysia({
  prefix: "/blog",
})
  // GET /blog
  .get("/", async ({ set }) => {
    try {
      const posts = await BlogServices.getAll();
      return posts;
    } catch (e) {
      return set(500, "Failed to fetch posts");
    }
  })

  // GET /blog/:id
  .get("/:id", async ({ params: { id }, set }) => {
    const post = await BlogServices.getById(id);
    if (!post) return set(404, "Post not found");
    return post;
  })

  // PATCH /blog/:id
  .patch("/:id", async ({ params: { id }, body, set }) => {
    try {
      const updatedPost = await BlogServices.update(id, body);
      if (!updatedPost) return set(404, "Post not found or update failed");
      return updatedPost;
    } catch (e) {
      return set(500, "Internal server error");
    }
  }, {
    body: t.Object({
      title: t.Optional(t.String()),
      etat: t.Optional(t.String()),
      date: t.Optional(t.String()), // Handles "MAR 2026"
      readTime: t.Optional(t.String()),
      image: t.Optional(t.String()),
      content: t.Optional(t.String())
    })
  })

  // DELETE /blog/:id
  .delete("/:id", async ({ params: { id }, set }) => {
    try {
      const deleted = await BlogServices.delete(id);
      if (!deleted) return set(404, "Post not found");
      return { message: "Post deleted successfully" };
    } catch (e) {
      return set(500, "Failed to delete post");
    }
  });
