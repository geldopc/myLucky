import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@elements": path.resolve(import.meta.dirname, "./src/components/elements"),
      "@widgets": path.resolve(import.meta.dirname, "./src/components/widgets"),
      "@modules": path.resolve(import.meta.dirname, "./src/components/modules"),
      "@templates": path.resolve(import.meta.dirname, "./src/components/templates"),
      "@pages": path.resolve(import.meta.dirname, "./src/pages"),
      "@utils": path.resolve(import.meta.dirname, "./src/utils"),
      "@hooks": path.resolve(import.meta.dirname, "./src/hooks"),
      "@providers": path.resolve(import.meta.dirname, "./src/providers"),
    },
  },
});
