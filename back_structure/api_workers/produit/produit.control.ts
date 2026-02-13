import { Elysia, t } from "elysia";
import { produitServices } from "./produit.service";

export const produitController = new Elysia({ prefix: "/produit" })
  // GET /produit
  .get("/", async () => {
    return await produitServices.getAll();
  })

  // GET /produit/:id
  .get("/:id", async ({ params: { id }, error }) => {
    const product = await produitServices.getById(id);
    if (!product) return error(404, "Product not found");
    return product;
  })

  // POST /produit
  .post("/", async ({ body, set }) => {
    const newProduct = await produitServices.create(body);
    set.status = 201;
    return newProduct;
  }, {
    // Basic validation using Elysia's TypeBox (t)
    body: t.Object({
      title: t.String(),
      subtitle: t.Optional(t.String()),
      price: t.Number(),
      image: t.String(),
      etat: t.String(),
      description: t.String(),
      specs: t.Any() // Since we use JSONB in Postgres
    })
  })
  // PATCH /produit/:id
  .patch("/:id", async ({ params: { id }, body, error }) => {
    try {
      const updatedProduct = await produitServices.update(id, body);
      return updatedProduct;
    } catch (e) {
      // Handles case where ID doesn't exist in DB
      return error(404, "Product not found or update failed");
    }
  }, {
    // Validation: All fields are optional for a PATCH request
    body: t.Object({
      title: t.Optional(t.String()),
      subtitle: t.Optional(t.String()),
      price: t.Optional(t.Number()),
      image: t.Optional(t.String()),
      etat: t.Optional(t.String()),
      description: t.Optional(t.String()),
      specs: t.Optional(t.Any())
    })
  })

  // DELETE /produit/:id
  .delete("/:id", async ({ params: { id } }) => {
    return await produitServices.delete(id);
  });