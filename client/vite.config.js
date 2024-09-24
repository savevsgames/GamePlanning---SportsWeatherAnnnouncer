import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
  return {
    base: command === "build" ? "/" : "/", // Ensure proper base path for production
    server: {
      port: 3000,
      open: true,
      proxy: {
        "/api": {
          target: "http://localhost:3001",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
    },
  };
});
