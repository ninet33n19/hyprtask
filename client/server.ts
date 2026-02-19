import { join } from "node:path";

const clientDir = import.meta.dir;

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const file = Bun.file(join(clientDir, "index.html"));
      return new Response(file, {
        headers: { "Content-Type": "text/html" },
      });
    }
    if (url.pathname === "/main.tsx") {
      const result = await Bun.build({
        entrypoints: [join(clientDir, "main.tsx")],
        outdir: clientDir,
        target: "browser",
        minify: false,
        sourcemap: "none",
      });
      if (!result.success) {
        console.error("Build failed:", result.logs);
        return new Response("Build failed", { status: 500 });
      }
      const blob = result.outputs[0];
      return new Response(blob, {
        headers: { "Content-Type": "application/javascript" },
      });
    }
    if (url.pathname === "/styles.css") {
      const file = Bun.file(join(clientDir, "styles.css"));
      return new Response(file, {
        headers: { "Content-Type": "text/css" },
      });
    }
    return new Response("Not found", { status: 404 });
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log(`Client dev server at http://localhost:${server.port}`);
