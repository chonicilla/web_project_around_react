import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const servePublicIndexHtml = () => {
  const htmlPath = path.resolve(__dirname, "public", "index.html");
  return {
    name: "serve-public-index-html",
    configureServer(server) {
      server.middlewares.use("/", async (req, res, next) => {
        if (req.url === "/" || req.url === "/index.html") {
          try {
            const rawHtml = fs.readFileSync(htmlPath, "utf-8");
            const transformed = await server.transformIndexHtml(
              req.url === "/" ? "/index.html" : req.url,
              rawHtml,
              req.originalUrl,
            );
            res.setHeader("Content-Type", "text/html");
            res.statusCode = 200;
            res.end(transformed);
            return;
          } catch (err) {
            return next(err);
          }
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use("/", (req, res, next) => {
        if (req.url === "/" || req.url === "/index.html") {
          const distHtml = path.resolve(__dirname, "dist", "index.html");
          if (fs.existsSync(distHtml)) {
            const html = fs.readFileSync(distHtml, "utf-8");
            res.setHeader("Content-Type", "text/html");
            res.statusCode = 200;
            res.end(html);
            return;
          }
        }
        next();
      });
    },
    closeBundle() {
      const dist = path.resolve(__dirname, "dist");
      const distPublicHtml = path.resolve(dist, "public", "index.html");
      const distHtml = path.resolve(dist, "index.html");
      if (fs.existsSync(distPublicHtml)) {
        let html = fs.readFileSync(distPublicHtml, "utf-8");
        html = html.replace(/\.\.\/assets\//g, "./assets/");
        fs.writeFileSync(distHtml, html, "utf-8");
        const distPublicDir = path.resolve(dist, "public");
        try {
          const entries = fs.readdirSync(distPublicDir, {
            withFileTypes: true,
          });
          const hasOnlyIndexHtml =
            entries.length === 1 &&
            entries[0].isFile() &&
            entries[0].name === "index.html";
          if (entries.length === 0 || hasOnlyIndexHtml) {
            fs.rmSync(distPublicDir, { recursive: true, force: true });
          }
        } catch (_) {
          // Carpeta pudo haber sido eliminada; ignorar
        }
      }
    },
  };
};

export default defineConfig({
  plugins: [react(), servePublicIndexHtml()],
  root: ".",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "public", "index.html"),
      },
    },
    copyPublicDir: false,
  },
  publicDir: "public",
  server: {
    open: true,
  },
  preview: {
    open: true,
  },
});
