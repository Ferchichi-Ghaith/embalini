import { Elysia, t } from "elysia";
import { produitServices } from "./produit.service";

export const produitController = new Elysia({ prefix: "/produit" })
  // GET /produit
  .get("/", async ({ set }) => {
    try {
      const products = await produitServices.getAll();
      return products;
    } catch (e) {
      set.status = 500;
      return { error: "Failed to fetch products" };
    }
  })

  // GET /produit/:id
  .get("/:id", async ({ params: { id }, set }) => {
    try {
      const product = await produitServices.getById(id);
      if (!product) {
        set.status = 404;
        return { error: "Product not found" };
      }
      return product;
    } catch (e) {
      set.status = 500;
      return { error: "Failed to fetch product" };
    }
  })

  // POST /produit
  .post("/", async ({ body, set }) => {
    try {
      const newProduct = await produitServices.create(body);
      set.status = 201;
      return newProduct;
    } catch (e) {
      set.status = 500;
      return { error: "Failed to create product" };
    }
  }, {
    body: t.Object({
      title: t.String(),
      subtitle: t.Optional(t.String()),
      price: t.Number(),
      image: t.String(),
      etat: t.String(),
      description: t.String(),
      specs: t.Any()
    })
  })

  // PATCH /produit/:id
  .patch("/:id", async ({ params: { id }, body, set }) => {
    try {
      const updatedProduct = await produitServices.update(id, body);
      if (!updatedProduct) {
        set.status = 404;
        return { error: "Product not found or update failed" };
      }
      return updatedProduct;
    } catch (e) {
      set.status = 500;
      return { error: "Internal server error" };
    }
  }, {
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
  .delete("/:id", async ({ params: { id }, set }) => {
    try {
      const deleted = await produitServices.delete(id);
      if (!deleted) {
        set.status = 404;
        return { error: "Product not found" };
      }
      return { message: `Product ${id} deleted successfully` };
    } catch (e) {
      set.status = 500;
      return { error: "Failed to delete product" };
    }
  });
