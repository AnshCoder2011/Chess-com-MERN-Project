import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// ✅ Stable Tailwind setup
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
