// vite.config.ts (example)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          "@primary-color": "#1890ff",
          "@border-radius-base": "10px",
          "@font-family": "'Inter', sans-serif",
        },
        javascriptEnabled: true,
      },
    },
  },
});
