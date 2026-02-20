import { Elysia, t } from "elysia";
import { produitServices } from "./produit.service";

export const produitController = new Elysia({ prefix: "/produit" })
  // GET /produit
  .get("/", async ({ set }) => {
    try {
      return await produitServices.getAll();
    } catch (e) {
      set.status = 500;
      return { error: "Failed to fetch products" };
    }
  })

  // GET /produit/category/:categoryId
  // Added to allow filtering by the new Category model
  .get("/category/:categoryId", async ({ params: { categoryId }, set }) => {
    try {
      return await produitServices.getByCategory(categoryId);
    } catch (e) {
      set.status = 500;
      return { error: "Failed to fetch products for this category" };
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
      // Detailed error logging might be helpful here for debugging relations
      return { error: "Failed to create product. Ensure categoryId is valid." };
    }
  }, {
    body: t.Object({
      title: t.String(),
      price: t.Number(),
      image: t.String(),
      description: t.String(),
      specs: t.Any(),
      categoryId: t.String(), // Required: Links product to Category
      etat: t.Optional(t.String()) // Field from your API "etat"
    })
  })

  // PATCH /produit/:id
  .patch("/:id", async ({ params: { id }, body, set }) => {
    try {
      const updatedProduct = await produitServices.update(id, body);
      return updatedProduct;
    } catch (e) {
      set.status = 500;
      return { error: "Internal server error" };
    }
  }, {
    body: t.Object({
      title: t.Optional(t.String()),
      price: t.Optional(t.Number()),
      image: t.Optional(t.String()),
      description: t.Optional(t.String()),
      specs: t.Optional(t.Any()),
      categoryId: t.Optional(t.String()), // Allow moving product to a different category
      etat: t.Optional(t.String())
    })
  })

  // DELETE /produit/:id
  .delete("/:id", async ({ params: { id }, set }) => {
    try {
      await produitServices.delete(id);
      return { message: `Product ${id} deleted successfully` };
    } catch (e) {
      set.status = 404; // Usually fails because ID doesn't exist
      return { error: "Product not found or already deleted" };
    }
  });