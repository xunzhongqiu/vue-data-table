import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
export default defineConfig({ plugins: [vue()], build: { lib: { entry: "src/index.ts", formats: ["es", "umd"], name: "VueDataTable", fileName: (format) => `vue-data-table.${format}.js` }, rollupOptions: { external: ["vue"], output: { globals: { vue: "Vue" } } } } });
