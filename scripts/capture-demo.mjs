import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const outDir = process.argv[2] || '/tmp/vyberai-shots'
await mkdir(outDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
await page.screenshot({ path: `${outDir}/landing-desktop.png`, fullPage: false })

await page.getByRole('button', { name: 'Spustiť chat' }).click()
await page.getByRole('button', { name: 'Notebook do 800 € na školu' }).click()
await page.waitForSelector('.rec-item', { timeout: 5000 })
await page.waitForTimeout(500)
await page.screenshot({ path: `${outDir}/chat-recommendations-desktop.png`, fullPage: false })

await page.setViewportSize({ width: 390, height: 844 })
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
await page.screenshot({ path: `${outDir}/landing-mobile.png`, fullPage: false })
await page.getByRole('button', { name: 'Notebook do 800 € na školu' }).click()
await page.waitForSelector('.rec-item', { timeout: 5000 })
await page.waitForTimeout(400)
await page.screenshot({ path: `${outDir}/chat-recommendations-mobile.png`, fullPage: false })

await browser.close()
console.log('screenshots written to', outDir)
