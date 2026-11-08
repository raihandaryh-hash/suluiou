import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  // B8: build ditolak bila VITE_API_BASE_URL terisi. Jalur backend PHP
  // (src/services/api.ts) belum punya pengaman setara kill-switch dan cabang distress.
  if (command === "build") {
    const apiBase = process.env.VITE_API_BASE_URL ?? loadEnv(mode, process.cwd(), "VITE_").VITE_API_BASE_URL;
    if (apiBase) {
      throw new Error(
        "B8: VITE_API_BASE_URL terisi. Build ditolak sampai backend PHP lolos uji pengaman setara (kill-switch, cabang distress, kunci asesmen).",
      );
    }
  }
  return {
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};
});
