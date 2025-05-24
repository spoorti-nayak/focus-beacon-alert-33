
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🚀 Starting MERN + Electron Development Environment...');

// Function to spawn a process with proper output handling
function spawnProcess(command, args, options = {}) {
  console.log(`▶️  Starting: ${command} ${args.join(' ')}`);
  
  const child = spawn(command, args, {
    cwd: rootDir,
    stdio: 'pipe',
    shell: true,
    ...options
  });

  child.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      console.log(`[${command}] ${output}`);
    }
  });

  child.stderr.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      console.error(`[${command}] ${output}`);
    }
  });

  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`❌ [${command}] Process exited with code ${code}`);
    }
  });

  child.on('error', (error) => {
    console.error(`❌ [${command}] Error:`, error.message);
  });

  return child;
}

// Start all processes
const processes = [];

try {
  // Start Express API server
  console.log('🗄️  Starting Express API Server...');
  const serverProcess = spawnProcess('node', ['server/index.js']);
  processes.push(serverProcess);

  // Start Vite dev server  
  console.log('⚛️  Starting React Vite Server...');
  const viteProcess = spawnProcess('npm', ['run', 'dev']);
  processes.push(viteProcess);

  // Wait for servers to start, then launch Electron
  setTimeout(() => {
    console.log('🖥️  Starting Electron App...');
    const electronProcess = spawnProcess('npm', ['run', 'electron-dev']);
    processes.push(electronProcess);
  }, 4000);

} catch (error) {
  console.error('❌ Error starting development environment:', error);
}

// Handle process termination
function cleanup() {
  console.log('\n🔄 Shutting down development environment...');
  processes.forEach(process => {
    if (process && !process.killed) {
      process.kill('SIGTERM');
    }
  });
  setTimeout(() => {
    process.exit(0);
  }, 1000);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

console.log('✅ Development environment started!');
console.log('📝 Use Ctrl+C to stop all processes');
