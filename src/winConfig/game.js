import { BrowserWindow, Tray, Menu } from 'electron';
import path from 'node:path';
import { thisIcon, nextWorkerClaim, syslog } from '../index.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import colors from 'colors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);

let gameWindow;
let contextMenu;
let globalTray;
let trayUpdateInterval;

function updateTrayMenu(){
  let timeToClaim = nextWorkerClaim - Date.now();
  let claimable = false;
  if (timeToClaim < 0) {
    claimable = true;
  }
  contextMenu = Menu.buildFromTemplate([
    { label: `${ claimable ? "Workers are ready to claim!" : ("Next claim in: " + ( Math.floor((timeToClaim % 3600000) / 3600000) < 1 ? "" : Math.floor((timeToClaim % 3600000) / 3600000).toString() + "h" ) + ( Math.floor((timeToClaim % 3600000) / 60000) < 1 ? "<1m" : ( Math.floor((timeToClaim % 3600000) / 3600000) < 1 ? Math.floor((timeToClaim % 3600000) / 60000).toString() + "m" : ", " + Math.floor((timeToClaim % 3600000) / 60000).toString() + "m" ) ))}`, enabled: false },
    { type: 'separator' },
    { label: "Open Chaotic Capital", click: () => {
        if (!gameWindow || gameWindow === null) {
            loadGameWindow();
            gameWindow.maximize();
        } else {
            gameWindow.maximize();
        }
    }},
    { label: "Quit", click: () => {
        app.quit();
    }}
  ]);
  globalTray.setContextMenu(contextMenu);
  globalTray.setToolTip('Chaotic Capital');

  syslog("[SYSTM] Updated Tray; New timer: " + `${ claimable ? "Workers are ready to claim!" : ("Next claim in: " + ( Math.floor((timeToClaim % 3600000) / 3600000) < 1 ? "" : Math.floor((timeToClaim % 3600000) / 3600000).toString() + "h" ) + ( Math.floor((timeToClaim % 3600000) / 60000) < 1 ? "<1m" : ( Math.floor((timeToClaim % 3600000) / 3600000) < 1 ? Math.floor((timeToClaim % 3600000) / 60000).toString() + "m" : ", " + Math.floor((timeToClaim % 3600000) / 60000).toString() + "m" ) ))}`);
}

export default function loadGameWindow(){
  if (gameWindow) {
    gameWindow.webContents.reload();
    gameWindow.maximize();
    return;
  }
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

  if (!globalTray) {
    globalTray = new Tray(thisIcon);

    globalTray.on('click', () => {
      updateTrayMenu();
    });
  
    globalTray.on('right-click', () => {
      updateTrayMenu();
    });
    trayUpdateInterval = setInterval(updateTrayMenu, 15000);
  }

  gameWindow.maximize();
}

export { gameWindow, globalTray, updateTrayMenu };