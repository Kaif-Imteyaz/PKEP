import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  base: "./", // Ensures correct asset paths
  build: {
    outDir: "dist", // Default is "dist"
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
})