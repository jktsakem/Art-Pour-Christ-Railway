import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { imagetools } from "vite-imagetools";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    // Convertit automatiquement les images importées en WebP au build
    // hero-worship.jpg (759KB) → ~110KB  |  logo.png (828KB) → ~80KB
    imagetools({
      defaultDirectives: (url) => {
        const ext = url.pathname.split(".").pop()?.toLowerCase();
        if (ext === "jpg" || ext === "jpeg") {
          return new URLSearchParams({ format: "webp", quality: "82" });
        }
        if (ext === "png") {
          return new URLSearchParams({ format: "webp", quality: "85" });
        }
        return new URLSearchParams();
      },
    }),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Sépare en chunks pour un meilleur cache navigateur (vendor, UI, app)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-switch",
            "@radix-ui/react-label",
            "@radix-ui/react-dropdown-menu",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
  },
}));
