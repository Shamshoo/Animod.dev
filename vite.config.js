import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  server: {
    // Allow all subdomains of trycloudflare.com and animod.dev
    // This is more secure than allowing all hosts ('*')
    allowedHosts: ['.trycloudflare.com', 'animod.dev'],
  },
})
