import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Inject AFFILIATE_ID at build time (Cursor app secret / CI env).
// Never prefix with VITE_ — that is reserved by Cursor Apps hosting.
const affiliateId = process.env.AFFILIATE_ID?.trim() || 'AFFILIATE_ID'

export default defineConfig({
  plugins: [react()],
  define: {
    __VYBER_AFFILIATE_ID__: JSON.stringify(affiliateId),
  },
})
