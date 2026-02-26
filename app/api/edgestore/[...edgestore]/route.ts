import { initEdgeStore } from "@edgestore/server";
import {
  CreateContextOptions,
  createEdgeStoreNextHandler,
} from "@edgestore/server/adapters/next/app";

type Context = {
  userId: string;
  userRole: "admin" | "user";
};

function createContext({ req }: CreateContextOptions): Context {
  // IMPORTANT: For production, get real session data here.
  // Currently setting as 'admin' to allow the operations below.
  return {
    userId: "1234",
    userRole: "admin", 
  };
}

const es = initEdgeStore.context<Context>().create();

const edgeStoreRouter = es.router({
  Emablini: es
    .imageBucket()
    /**
     * Add this section to enable Delete and Replace functionality
     */
    .beforeUpload(({ ctx }) => {
      // Allow upload/replace only if user is admin
      return ctx.userRole === "admin"; 
    })
    .beforeDelete(({ ctx }) => {
      // Allow deletion only if user is admin
      return ctx.userRole === "admin";
    }),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});

export { handler as GET, handler as POST };

export type EdgeStoreRouter = typeof edgeStoreRouter;