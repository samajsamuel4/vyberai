/**
 * Thin launcher kept for older start commands.
 * Prefer `npm start` → tsx scripts/serve.ts
 */
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const child = spawn(
  process.execPath,
  ['--import', 'tsx', path.join(root, 'scripts/serve.ts')],
  { stdio: 'inherit', cwd: root, env: process.env },
)

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  process.exit(code ?? 1)
})
