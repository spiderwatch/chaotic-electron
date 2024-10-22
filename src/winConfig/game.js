import { BrowserWindow } from 'electron';
import path from 'node:path';
import { thisIcon } from '../index.js';

let gameWindow;

export default function loadGameWindow(){
  gameWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
    },
    frame: true,
    resizable: true,
    autoHideMenuBar: true,
    icon: thisIcon,
    title: "Chaotic Capital"
  });

  gameWindow.loadURL("http://localhost:4932/home/test");
  // DevTools
  //gameWindow.webContents.openDevTools();

  gameWindow.on('closed', function () {
    gameWindow = null;
  });

  gameWindow.maximize();
}

export { gameWindow };