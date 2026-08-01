import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "react-dom",
        "react-dom/client",
        "react-router",
        /@aws-sdk\/.*/,
      ],
    },
    sourcemap: true,
  },
  plugins: [react()],
  server: {
    port: 5000,
  },
});
