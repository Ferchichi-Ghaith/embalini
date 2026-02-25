import { Elysia, t } from "elysia";
import { commandServices } from "./command.service";
import { OrderStatus } from "@/generated/prisma";

export const commandController = new Elysia({
  prefix: "/command",
})
  // GET /command
  .get("/", async ({ set }) => {
    try {
      const commands = await commandServices.getAll();
      return commands;
    } catch (e) {
      set.status = 500;
      return { error: "Failed to fetch commands" };
    }
  })

  // POST /command
  .post("/", async ({ body, set }) => {
    try {
      const newOrder = await commandServices.create(body);
      set.status = 201;
      return newOrder;
    } catch (e) {
      console.error(e);
      set.status = 500;
      return { error: "Failed to create order" };
    }
  }, {
    body: t.Object({
      order_id: t.String(),
      secret_code: t.String(),
      nom: t.String(),
      prenom: t.String(),
      email: t.String({ format: 'email' }),
      telephone: t.String(),
      message: t.Optional(t.String()),
      total_estimation: t.Number(), // Prisma Decimal accepts Number or String
      currency: t.Optional(t.String({ default: "TND" })),
      // Validation for nested items
      items: t.Array(t.Object({
        original_id: t.String(),
        titre: t.String(),
        quantite: t.Number({ minimum: 1 }),
        prix_unitaire: t.Number(),
        prix_total: t.Number(),
        productimage: t.String()
      }))
    }),
    detail: { 
      tags: ['command'], 
      summary: 'Place a new order with items'
    }
  })

// Change "/:id" to "/:secret_code"
.get("/:secret_code", async ({ params: { secret_code }, set }) => {
  try {
    // Now secret_code will actually contain the string from the URL
    const command = await commandServices.getBySecret(secret_code);
    
    if (!command) {
      set.status = 404;
      return { error: "no exist" };
    }
    
    return command;
  } catch (e) {
    console.error(e); // Log the error to see exactly why it fails
    set.status = 500;
    return { error: "Failed to fetch command" };
  }
})

  // PATCH /command/:id
  .patch("/:id", async ({ params: { id }, body, set }) => {
    try {
      const updatedCommand = await commandServices.update(id, body);
      if (!updatedCommand) {
        set.status = 404;
        return { error: "Command not found or update failed" };
      }
      return updatedCommand;
    } catch (e) {
      set.status = 500;
      return { error: "Internal server error" };
    }
  }, {
    body: t.Object({
      status: t.Optional(t.Enum(OrderStatus))
    })
  })
  // 1. GET /command/count
  // IMPORTANT: This must come BEFORE the /:secret_code route
  .get("/count", async ({ set }) => {
    try {
      const count = await commandServices.countCommands();
      return { 
        total: count,
        timestamp: new Date().toISOString()
      };
    } catch (e) {
      console.error("Count Error:", e);
      set.status = 500;
      return { error: "Failed to retrieve command count" };
    }
  })

  // DELETE /command/:id
  .delete("/:id", async ({ params: { id }, set }) => {
    try {
      const deleted = await commandServices.delete(id);
      if (!deleted) {
        set.status = 404;
        return { error: "Command not found" };
      }
      return { message: `Order ${id} deleted successfully` };
    } catch (e) {
      set.status = 500;
      return { error: "Failed to delete command" };
    }
  });
