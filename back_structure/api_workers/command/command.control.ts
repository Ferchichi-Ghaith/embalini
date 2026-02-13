import { Elysia, t } from "elysia";
import { commandServices } from "./command.service";
import { OrderStatus } from "@/generated/prisma";


export const commandController = new Elysia({
  prefix: "/command",
})
  // GET /command
  .get("/", async () => {
    return await commandServices.getAll();
  })

  // GET /command/:id
  .get("/:id", async ({ params: { id }, error }) => {
    const command = await commandServices.getById(id);
    if (!command) return error(404, "Command not found");
    return command;
  })

  // PATCH /command/:id (Update Status or Info)
  .patch("/:id", async ({ params: { id }, body, error }) => {
    try {
      return await commandServices.update(id, body);
    } catch (e) {
      return error(404, "Update failed: Command not found");
    }
  }, {
    body: t.Object({
      // We validate the status against your Prisma Enum
      status: t.Optional(t.Enum(OrderStatus)),
     
    })
  })

  // DELETE /command/:id
  .delete("/:id", async ({ params: { id } }) => {
    await commandServices.delete(id);
    return { message: `Order ${id} deleted` };
  });