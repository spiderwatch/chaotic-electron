import { BrowserWindow } from 'electron';
import path from 'node:path';
import { thisIcon } from '../index.js';

let gameWindow;

export default function loadGameWindow(){
  gameWindow = new BrowserWindow({
    webPreferences: {
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
    backgroundColor: '#000000',
    titleBarStyle: "default",
    transparent: false,
  });

  gameWindow.loadURL("http://localhost:4932/home/test");
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