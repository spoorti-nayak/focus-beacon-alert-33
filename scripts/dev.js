
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Function to spawn a process with proper output handling
function spawnProcess(command, args, options = {}) {
  console.log(`Starting: ${command} ${args.join(' ')}`);
  
  const child = spawn(command, args, {
    cwd: rootDir,
    stdio: 'pipe',
    shell: true,
    ...options
  });

  child.stdout.on('data', (data) => {
    console.log(`[${command}] ${data.toString().trim()}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`[${command}] ${data.toString().trim()}`);
  });

  child.on('close', (code) => {
    console.log(`[${command}] Process exited with code ${code}`);
  });

  return child;
}

// Start all processes
console.log('Starting development environment...');

// Start Vite dev server
const viteProcess = spawnProcess('npm', ['run', 'dev']);

// Start API server
const serverProcess = spawnProcess('node', ['server/index.js']);

// Wait a bit for servers to start, then launch Electron
setTimeout(() => {
  const electronProcess = spawnProcess('npm', ['run', 'electron-dev']);
}, 3000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down development environment...');
  viteProcess.kill();
  serverProcess.kill();
  process.exit(0);
});
