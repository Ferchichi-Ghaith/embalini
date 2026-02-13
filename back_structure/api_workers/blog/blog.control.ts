import { Elysia, t } from "elysia";
import { BlogServices } from "./blog.service";

export const BlogsController = new Elysia({
  prefix: "/blog",
})
  // GET /post
  .get("/", async () => {
    return await BlogServices.getAll();
  })

  // GET /post/:id
  .get("/:id", async ({ params: { id }, error }) => {
    const post = await BlogServices.getById(id);
    if (!post) return error(404, "Post not found");
    return post;
  })

  // PATCH /post/:id
  .patch("/:id", async ({ params: { id }, body, error }) => {
    try {
      const updatedPost = await BlogServices.update(id, body);
      return updatedPost;
    } catch (e) {
      return error(404, "Post not found or update failed");
    }
  }, {
    // Validation for partial updates
    body: t.Object({
      title: t.Optional(t.String()),
      etat: t.Optional(t.String()),
      date: t.Optional(t.String()), // Handles "MAR 2026" format
      readTime: t.Optional(t.String()),
      image: t.Optional(t.String()),
      content: t.Optional(t.String())
    })
  })

  // DELETE /post/:id
  .delete("/:id", async ({ params: { id } }) => {
    await BlogServices.delete(id);
    return { message: "Post deleted successfully" };
  });