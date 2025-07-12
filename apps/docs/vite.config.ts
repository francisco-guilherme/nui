import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import docs from "../../packages/vite-plugin-docs";

export default defineConfig({
  plugins: [react(), tailwindcss(), docs()],
});
