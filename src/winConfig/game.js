import { BrowserWindow } from 'electron';
import path from 'node:path';
import { thisIcon } from '../index.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);

let gameWindow;

export default function loadGameWindow(){
  gameWindow = new BrowserWindow({
    webPreferences: {
        contextBridge: true,
        preload: path.join(__dirname, '../preload.js'),
        nodeIntegration: false,
        sandbox: true,
    },
    frame: true,
    resizable: true,
    autoHideMenuBar: true,
    icon: thisIcon,
    title: "Chaotic Capital",
    maximizable: true,
    minimizable: true,
    fullscreenable: true,
    show: true,
    titleBarStyle: "default",
    transparent: false,
  });

  gameWindow.loadURL("http://localhost:4932/home/test");
  // gameWindow.loadURL("file://" + __dirname + "/../render/dummy.html");
  // DevTools
  //gameWindow.webContents.openDevTools();

  gameWindow.on('closed', function () {
    gameWindow = null;
  });

  gameWindow.on('show', function () {
    gameWindow.maximize();
  });
}

export { gameWindow };