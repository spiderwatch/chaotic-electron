import { BrowserWindow } from 'electron';
import path from 'node:path';
import { thisIcon } from '../index.js';

let loader;

export default function openLoader() {
  loader = new BrowserWindow({
    width: 300,
    height: 400,
    webPreferences: {
      nodeIntegration: false,
    },
    frame: false,
    resizable: false,
    autoHideMenuBar: true,
    icon: thisIcon,
    title: "Chaotic Capital"
  });

  loader.loadFile(path.join(import.meta.dirname, '../loader.html'));
}

export { loader };