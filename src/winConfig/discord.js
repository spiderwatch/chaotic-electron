import { BrowserWindow } from 'electron';
import path from 'node:path';
import { thisIcon } from '../index.js';

let discordAuthWindow;

export default function loadDiscordAuthHandler(){
  discordAuthWindow = new BrowserWindow({
    width: 400,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
    },
    frame: true,
    resizable: true,
    autoHideMenuBar: true,
    icon: thisIcon,
    title: "Chaotic Capital"
  });

  discordAuthWindow.loadURL('https://discord.com/oauth2/authorize?client_id=1295600323561521193&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A4932%2FauthCallback&scope=identify+email');

  discordAuthWindow.on('closed', function () {
    discordAuthWindow = null;
  });
}

export { discordAuthWindow };