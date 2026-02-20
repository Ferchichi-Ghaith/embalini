import { Elysia, t } from "elysia";
import { categoryServices } from "./cat.services";

export const categoryController = new Elysia({ prefix: "/category" })
  // GET /category
  .get("/", async ({ set }) => {
    try {
      return await categoryServices.getAll();
    } catch (e) {
      set.status = 500;
      return { error: "Failed to fetch categories" };
    }
  })

  // POST /category
  .post("/", async ({ body, set }) => {
    try {
      const newCategory = await categoryServices.create(body);
      set.status = 201;
      return newCategory;
    } catch (e) {
      set.status = 500;
      return { error: "Failed to create category" };
    }
  }, {
    body: t.Object({
      title: t.String(),
      image: t.String()
    })
  })

  // PATCH /category/:id
  .patch("/:id", async ({ params: { id }, body, set }) => {
    try {
      return await categoryServices.update(id, body);
    } catch (e) {
      set.status = 500;
      return { error: "Update failed" };
    }
  }, {
    body: t.Object({
      title: t.Optional(t.String()),
      image: t.Optional(t.String())
    })
  })

  // DELETE /category/:id
  .delete("/:id", async ({ params: { id }, set }) => {
    try {
      await categoryServices.delete(id);
      return { message: "Category deleted" };
    } catch (e) {
      set.status = 404;
      return { error: "Category not found" };
    }
  });