const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      contextIsolation: true
    }
  });

  win.loadURL('http://localhost:3000');
}

function startBackend() {
  const nodePath = process.execPath;
  const backendPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'backend', 'index.js');

   console.log(`Starting nodepath with command: ${nodePath}`);
   console.log(`Starting backend with command: ${backendPath}`);

  backendProcess = spawn('node', [backendPath], {
    shell: true,
    stdio: 'inherit',
  });

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend:', err);
  });

  backendProcess.on('exit', (code) => {
    console.log(`Backend exited with code ${code}`);
  });
}

app.whenReady().then(() => {
  startBackend();
  setTimeout(() => {
    createWindow();
  }, 3000); // wait 3s to let backend start
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
