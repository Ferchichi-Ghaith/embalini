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

  // GET /command/:id
  .get("/:id", async ({ params: { id }, set }) => {
    try {
      const command = await commandServices.getById(id);
      if (!command) {
        set.status = 404;
        return { error: "Command not found" };
      }
      return command;
    } catch (e) {
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
