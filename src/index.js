import { app, ipcMain, Notification, Tray, Menu, nativeImage } from 'electron';
import localServer from 'express';
import path from 'node:path';
import io from 'socket.io-client';
import colors from 'colors';

import sqlite3 from 'sqlite3';
import express from 'express';
import fs from 'node:fs';

import defaultRouter from './express_routes.js';
import openLoader from './winConfig/loader.js';
import loadGameWindow from './winConfig/game.js';
import loadDiscordAuthHandler from './winConfig/discord.js';

import { loader } from './winConfig/loader.js';
import { gameWindow } from './winConfig/game.js';
import { discordAuthWindow } from './winConfig/discord.js';


/* To-Do:
 - Fetch user's unlocked workers, their prices, and their purchase status and store it in config.workers (see legacy config for structure)
*/

let config = {
  "gameTitle": "Chaotic Capital",
  "discord": {
      "clientID": "1295600323561521193"
  },
  "domain": {
      "protocol": "http",
      "tld": "localhost",
      "port": "4932"
  }
};

let thisUser;
let socket;
let thisToken;
let nextWorkerClaim;
let nextWorkerClaimTimer;
let globalTray;

let thisIcon = nativeImage.createFromPath(path.join(import.meta.dirname, '/cc_new.png'));
console.log("Found icon: " + path.join(import.meta.dirname, '/cc_new.png').toString());

let app_folder = app.getPath('appData');
console.log("Found app data folder: " + app_folder);
console.log("Platform: " + process.platform);

if (!fs.existsSync(app_folder + '/chaotic-electrons')) { fs.mkdirSync(app_folder + '/chaotic-electrons'); };
if (process.platform === 'win32') { app_folder = app_folder + '\\chaotic-electrons'; } else if (process.platform === 'darwin') { app_folder = app_folder + '/chaotic-electrons'; } else if (process.platform === 'linux') { app_folder = app_folder + '/chaotic-electrons'; };
console.log("Found game data folder: " + app_folder);  

async function syslog(toLog, color){
  console.log(color(`[${new Date().toISOString()}] ${toLog}`));
}

// connect to the database if it exists, if not, create it
let db = new sqlite3.Database(app_folder + '/game.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the game database.');

  db.run(`CREATE TABLE IF NOT EXISTS token (token TEXT)`, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
});

const server = localServer();
server.set('views', path.join(import.meta.dirname, 'render'));
server.use(express.json());
server.use((req, res, next) => {
  syslog(`${req.method} ${req.url}`, colors.green);
  next();
});
server.use('/', defaultRouter);
server.listen(config.domain.port, () => {
  console.log(`Game client listening at ::${config.domain.port}`);
});

app.on('ready', () => {
  openLoader();

  console.log('Ordering dinner...');
  socket = io('https://oracle.acethewildfire.me:4931');
  let start = Date.now();

  socket.on('connect', () => {
    let end = Date.now();
    console.log('Dinner was delivered in ' + (end - start) + 'ms');
    if (!gameWindow || gameWindow === null) {
      try {
        db.get("SELECT * FROM token", [], (err, row) => {
          if (err) {
            console.error(err.message);
          }
          if (row) {
            socket.emit('auth', {
              auth: row.token
            }, "GET");
          } else {
            loadDiscordAuthHandler();
          }
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      gameWindow.webContents.reload();
    }
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from the server');
    start = Date.now();
  });

  socket.on('auth', (data) => {
    if (data.success) {
      if (data.auth){
        db.run("DELETE FROM token", [], (err) => {
          if (err) {
            console.error(err.message);
          }
        });
        db.run("INSERT INTO token (token) VALUES (?)", [data.auth], (err) => {
          if (err) {
            console.error(err.message);
          }
        });
        thisToken = data.auth;
        socket.emit('workers', {
          auth: data.auth
        }, "CONFIG");
        socket.emit('me', {
          auth: data.auth
        }, "GET");
        socket.emit('startData', {
          auth: data.auth
        }, "GET");
      } else {
        db.get("SELECT * FROM token", [], (err, row) => {
          if (err) {
            console.error(err.message);
          }
          if (row) {
            thisToken = row.token;
            socket.emit('workers', {
              auth: row.token
            }, "CONFIG");
            socket.emit('me', {
              auth: row.token
            }, "GET");
            socket.emit('startData', {
              auth: row.token
            }, "GET");
          }
        });
      }
    } else {
      loadDiscordAuthHandler();
    }
  });

  socket.on('startData', (data) => {
    thisUser = data.user;
    loader.close();
    loadGameWindow();
  });

  socket.on('workers', (data) => {
    if (data.method === "CONFIG") {
      config.workers = data.global;
    }
  });

  socket.on('me', (data) => {
    console.log(data);
    thisUser = data.user;
    thisUser.nextWorkerClaim = data.nextWorkerClaim;
    nextWorkerClaimTimer = setInterval(() => {
      // nextWorkerClaim is a UNIX timestamp
      let nextWorkerClaim = new Date(thisUser.nextWorkerClaim).getTime();
      let now = new Date().getTime();
      let distance = nextWorkerClaim - now;
      if (distance < 0) {
        claimNotification(nextWorkerClaimTimer);
      }
    }, (1000 * 60 * 10)); // every 10 minutes
  });
});

let lastNotification;
function claimNotification(timer){
  if (lastNotification - Date.now() > (1000 * 60 * 10)) {
    console.log("Notification already sent within the last 10 mins." + (lastNotification - Date.now()));
    return;
  } else {
    let notification = new Notification({
      title: "Chaotic Capital",
      body: "You have workers ready to claim!"
    });
    notification.show();
    lastNotification = new Date();
  }
  clearInterval(timer);
}

app.on('activate', function () {
  if (gameWindow === null) {
    openLoader();
  }
});

app.whenReady().then(() => {
  globalTray = new Tray(thisIcon);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ]);
  globalTray.setToolTip('This is my application.');
  globalTray.setContextMenu(contextMenu);
});

// process.on('uncaughtException', (e) => {
//   syslog(e, colors.red);
// });


// IPC Main
ipcMain.handle('echo',  (event, msg) => {
  return msg;
});

ipcMain.handle('serverReq', async (event, msg) => {
  console.log("Main: " + msg);
  return "Main: " + msg;
});

export { thisUser, thisToken, thisIcon, config, socket };