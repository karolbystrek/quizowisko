import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    "/src/assets/*": async (req) => {
      const url = new URL(req.url);
      const file = Bun.file("." + url.pathname);
      if (await file.exists()) {
        return new Response(file);
      }
      return new Response("Not Found", { status: 404 });
    },
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
