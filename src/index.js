import { app, BrowserWindow, ipcMain } from 'electron';
import localServer from 'express';
import path from 'node:path';
import io from 'socket.io-client';
import colors from 'colors';

import sqlite3 from 'sqlite3';
import express from 'express';
import fs from 'node:fs';

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

let gameWindow;
let loader;
let discordAuthWindow;
let thisUser;
let socket;
let thisToken;

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

server.use(express.json());

server.use((req, res, next) => {
  syslog(`${req.method} ${req.url}`, colors.green);
  next();
});

server.use("/assets", express.static(path.join(import.meta.dirname, '/assets')));

server.get('/authCallback', (req, res) => {
  socket.emit('auth', {
    discordToken: req.query.code
  }, "POST");
  discordAuthWindow.close();
});

server.get('/home', (req, res) => {
  // fetch thisUser and render game.pug
  try {
    res.render(path.join(import.meta.dirname + "/render/dashboard.pug"), {
      user: thisUser,
      isSignedIn: true,
      showUserInNav: false,
      hasAlphaAccess: thisUser.access.alpha ?? false,
      isAdmin: thisUser.access.admin ?? false,
      config: config
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while rendering the page.");
  }
});
server.get('/home/test', (req, res) => {
  // fetch thisUser and render game.pug
  try {
    res.render(path.join(import.meta.dirname + "/render/dashboard_test.pug"), {
      user: thisUser,
      isSignedIn: true,
      showUserInNav: false,
      hasAlphaAccess: thisUser.access.alpha ?? false,
      isAdmin: thisUser.access.admin ?? false,
      config: config
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while rendering the page.");
  }
});

server.get('/leaderboard', (req, res) => {
  // fetch thisUser and render game
  try {
    res.render(path.join(import.meta.dirname + "/render/leaderboard.pug"), {
      user: thisUser,
      isSignedIn: true,
      showUserInNav: false,
      hasAlphaAccess: thisUser.access.alpha ?? false,
      isAdmin: thisUser.access.admin ?? false,
      config: config
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while rendering the page.");
  }
});
server.get('/leaderboard/test', (req, res) => {
  // fetch thisUser and render game
  try {
    res.render(path.join(import.meta.dirname + "/render/leaderboard_test.pug"), {
      user: thisUser,
      isSignedIn: true,
      showUserInNav: false,
      hasAlphaAccess: thisUser.access.alpha ?? false,
      isAdmin: thisUser.access.admin ?? false,
      config: config
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while rendering the page.");
  }
});

server.get('/friends', (req, res) => {
  // fetch thisUser and render game
  try {
    res.render(path.join(import.meta.dirname + "/render/friends.pug"), {
      user: thisUser,
      isSignedIn: true,
      showUserInNav: false,
      hasAlphaAccess: thisUser.access.alpha ?? false,
      isAdmin: thisUser.access.admin ?? false,
      config: config
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while rendering the page.");
  }
});
server.get('/friends/test', (req, res) => {
  // fetch thisUser and render game
  try {
    res.render(path.join(import.meta.dirname + "/render/friends_test.pug"), {
      user: thisUser,
      isSignedIn: true,
      showUserInNav: false,
      hasAlphaAccess: thisUser.access.alpha ?? false,
      isAdmin: thisUser.access.admin ?? false,
      config: config
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while rendering the page.");
  }
});

server.get('/shop', (req, res) => {
  // fetch thisUser and render game
  try {
    res.render(path.join(import.meta.dirname + "/render/shop.pug"), {
      user: thisUser,
      isSignedIn: true,
      showUserInNav: false,
      hasAlphaAccess: thisUser.access.alpha ?? false,
      isAdmin: thisUser.access.admin ?? false,
      config: config
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while rendering the page.");
  }
});
server.get('/shop/test', (req, res) => {
  // fetch thisUser and render game
  try {
    res.render(path.join(import.meta.dirname + "/render/shop_test.pug"), {
      user: thisUser,
      isSignedIn: true,
      showUserInNav: false,
      hasAlphaAccess: thisUser.access.alpha ?? false,
      isAdmin: thisUser.access.admin ?? false,
      config: config
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while rendering the page.");
  }
});

server.get('/bazaar', (req, res) => {
  // fetch thisUser and render game
  try {
    res.render(path.join(import.meta.dirname + "/render/bazaar.pug"), {
      user: thisUser,
      isSignedIn: true,
      showUserInNav: false,
      hasAlphaAccess: thisUser.access.alpha ?? false,
      isAdmin: thisUser.access.admin ?? false,
      config: config
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while rendering the page.");
  }
});
server.get('/bazaar/test', (req, res) => {
  // fetch thisUser and render game
  try {
    res.render(path.join(import.meta.dirname + "/render/bazaar_test.pug"), {
      user: thisUser,
      isSignedIn: true,
      showUserInNav: false,
      hasAlphaAccess: thisUser.access.alpha ?? false,
      isAdmin: thisUser.access.admin ?? false,
      config: config
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while rendering the page.");
  }
});

server.get('/workers', (req, res) => {
  // fetch thisUser and render game
  try {
    res.render(path.join(import.meta.dirname + "/render/workers.pug"), {
      user: thisUser,
      isSignedIn: true,
      showUserInNav: false,
      hasAlphaAccess: thisUser.access.alpha ?? false,
      isAdmin: thisUser.access.admin ?? false,
      config: config
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while rendering the page.");
  }
});
server.get('/workers/test', (req, res) => {
  // fetch thisUser and render game
  try {
    res.render(path.join(import.meta.dirname + "/render/workers_test.pug"), {
      user: thisUser,
      isSignedIn: true,
      showUserInNav: false,
      hasAlphaAccess: thisUser.access.alpha ?? false,
      isAdmin: thisUser.access.admin ?? false,
      config: config
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while rendering the page.");
  }
});

server.get('/backpack', (req, res) => {
  // fetch thisUser and render game
  try {
    res.render(path.join(import.meta.dirname + "/render/backpack.pug"), {
      user: thisUser,
      isSignedIn: true,
      showUserInNav: false,
      hasAlphaAccess: thisUser.access.alpha ?? false,
      isAdmin: thisUser.access.admin ?? false,
      config: config
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while rendering the page.");
  }
});
server.get('/backpack/test', (req, res) => {
  // fetch thisUser and render game
  res.render(path.join(import.meta.dirname + "/render/backpack_test.pug"), {
    user: thisUser,
    isSignedIn: true,
    showUserInNav: false,
    hasAlphaAccess: thisUser.access.alpha ?? false,
    isAdmin: thisUser.access.admin ?? false,
    config: config
  });
});

server.get('/wheel', (req, res) => {
  // fetch thisUser and render game
  res.render(path.join(import.meta.dirname + "/render/wheel.pug"), {
    user: thisUser,
    isSignedIn: true,
    showUserInNav: false,
    hasAlphaAccess: thisUser.access.alpha ?? false,
    isAdmin: thisUser.access.admin ?? false,
    config: config
  });
});
server.get('/wheel/test', (req, res) => {
  // fetch thisUser and render game
  res.render(path.join(import.meta.dirname + "/render/wheel_test.pug"), {
    user: thisUser,
    isSignedIn: true,
    showUserInNav: false,
    hasAlphaAccess: thisUser.access.alpha ?? false,
    isAdmin: thisUser.access.admin ?? false,
    config: config
  });
});

let package_ours = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, '../package.json'), 'utf8'));

server.get('/help-about', (req, res) => {
  // fetch thisUser and render game
  res.render(path.join(import.meta.dirname + "/render/about.pug"), {
    user: thisUser,
    isSignedIn: true,
    showUserInNav: false,
    hasAlphaAccess: thisUser.access.alpha ?? false,
    isAdmin: thisUser.access.admin ?? false,
    config: config,
    version: package_ours.version,
  });
});
server.get('/help-about/test', (req, res) => {
  // fetch thisUser and render game
  res.render(path.join(import.meta.dirname + "/render/help-about_test.pug"), {
    user: thisUser,
    isSignedIn: true,
    showUserInNav: false,
    hasAlphaAccess: thisUser.access.alpha ?? false,
    isAdmin: thisUser.access.admin ?? false,
    config: config
  });
});

server.get('/', (req, res) => {
  // fetch thisUser and render game
  res.render(path.join(import.meta.dirname + "/render/friends.pug"), {
    user: thisUser,
    isSignedIn: true,
    showUserInNav: false,
    hasAlphaAccess: thisUser.access.alpha ?? false,
    isAdmin: thisUser.access.admin ?? false,
    config: config
  });
});

server.use('/api/:endpoint', async (req, res) => {
  console.log(req.body);
  await apiSocket(`${req.params.endpoint}`, {
    auth: thisToken,
    body: req.body
  }, req.method, req, res);
});

server.use((req, res) => {
  res.status(404).sendFile(path.join(import.meta.dirname, '/404.html'));
});


server.listen(config.domain.port, () => {
  console.log(`Game client listening at ::${config.domain.port}`);
});

function openLoader() {
  loader = new BrowserWindow({
    width: 300,
    height: 400,
    webPreferences: {
      nodeIntegration: false,
    },
    frame: false,
    resizable: false,
    autoHideMenuBar: true,
    icon: path.join(import.meta.dirname, 'cc_new.ico'),
    title: "Chaotic Capital"
  });

  loader.loadFile(path.join(import.meta.dirname, 'loader.html'));
}

function loadGameWindow(){
  gameWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
    },
    frame: true,
    resizable: true,
    autoHideMenuBar: true,
    icon: path.join(import.meta.dirname, 'cc_new.ico'),
    title: "Chaotic Capital"
  });

  gameWindow.loadURL("http://localhost:4932/home");
  // DevTools
  //gameWindow.webContents.openDevTools();

  gameWindow.on('closed', function () {
    gameWindow = null;
  });

  gameWindow.maximize();
}

function loadDiscordAuthHandler(){
  discordAuthWindow = new BrowserWindow({
    width: 400,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
    },
    frame: true,
    resizable: true,
    autoHideMenuBar: true,
    icon: path.join(import.meta.dirname, 'cc_new.ico'),
    title: "Chaotic Capital"
  });

  discordAuthWindow.loadURL('https://discord.com/oauth2/authorize?client_id=1295600323561521193&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A4932%2FauthCallback&scope=identify+email');

  discordAuthWindow.on('closed', function () {
    discordAuthWindow = null;
  });
}

function apiSocket(endpoint, data, method, req, res){
  let thisWaitingPromise = new Promise((resolve, reject) => {
    socket.on(endpoint, (data) => {
      resolve(data);
    });
  });
  console.log("API: " + endpoint);
  socket.emit(endpoint, data, method);
  thisWaitingPromise.then((data) => {
    res.send(data);
  });
}

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
    loadGameWindow();
    loader.close();
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
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (gameWindow === null) {
    openLoader();
  }
});

process.on('uncaughtException', function (error) {
  console.error(error);
});


// IPC Main
ipcMain.handle('echo',  (event, msg) => {
  return msg;
});

ipcMain.handle('serverReq', async (event, msg) => {
  console.log("Main: " + msg);
  return "Main: " + msg;
});
