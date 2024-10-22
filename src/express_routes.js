import { Router } from 'express';
import fs from 'fs';
import path from 'path';

import { thisUser, thisToken, config, socket } from './index.js';
import express from 'express';

const router = Router();

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

router.use('/assets', express.static(path.join(import.meta.dirname, '/assets')));

router.get('/authCallback', (req, res) => {
  socket.emit('auth', {
    discordToken: req.query.code
  }, "POST");
  discordAuthWindow.close();
});

router.get('/home', (req, res) => {
  // fetch thisUser and render game.pug
  try {
    res.render("dashboard.pug", {
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
router.get('/home/test', (req, res) => {
  // fetch thisUser and render game.pug
  try {
    res.render("dashboard_test.pug", {
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

router.get('/leaderboard', (req, res) => {
  // fetch thisUser and render game
  try {
    res.render("leaderboard.pug", {
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
router.get('/leaderboard/test', (req, res) => {
  // fetch thisUser and render game
  try {
    res.render("leaderboard_test.pug", {
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

// router.get('/friends', (req, res) => {
//   // fetch thisUser and render game
//   try {
//     res.render(path.join(import.meta.dirname + "/render/friends.pug"), {
//       user: thisUser,
//       isSignedIn: true,
//       showUserInNav: false,
//       hasAlphaAccess: thisUser.access.alpha ?? false,
//       isAdmin: thisUser.access.admin ?? false,
//       config: config
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("An error occurred while rendering the page.");
//   }
// });
router.get('/friends/test', (req, res) => {
  // fetch thisUser and render game
  try {
    res.render("friends_test.pug", {
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

// router.get('/shop', (req, res) => {
//   // fetch thisUser and render game
//   try {
//     res.render(path.join(import.meta.dirname + "/render/shop.pug"), {
//       user: thisUser,
//       isSignedIn: true,
//       showUserInNav: false,
//       hasAlphaAccess: thisUser.access.alpha ?? false,
//       isAdmin: thisUser.access.admin ?? false,
//       config: config
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("An error occurred while rendering the page.");
//   }
// });
// router.get('/shop/test', (req, res) => {
//   // fetch thisUser and render game
//   try {
//     res.render(path.join(import.meta.dirname + "/render/shop_test.pug"), {
//       user: thisUser,
//       isSignedIn: true,
//       showUserInNav: false,
//       hasAlphaAccess: thisUser.access.alpha ?? false,
//       isAdmin: thisUser.access.admin ?? false,
//       config: config
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("An error occurred while rendering the page.");
//   }
// });

// router.get('/bazaar', (req, res) => {
//   // fetch thisUser and render game
//   try {
//     res.render(path.join(import.meta.dirname + "/render/bazaar.pug"), {
//       user: thisUser,
//       isSignedIn: true,
//       showUserInNav: false,
//       hasAlphaAccess: thisUser.access.alpha ?? false,
//       isAdmin: thisUser.access.admin ?? false,
//       config: config
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("An error occurred while rendering the page.");
//   }
// });
// router.get('/bazaar/test', (req, res) => {
//   // fetch thisUser and render game
//   try {
//     res.render(path.join(import.meta.dirname + "/render/bazaar_test.pug"), {
//       user: thisUser,
//       isSignedIn: true,
//       showUserInNav: false,
//       hasAlphaAccess: thisUser.access.alpha ?? false,
//       isAdmin: thisUser.access.admin ?? false,
//       config: config
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("An error occurred while rendering the page.");
//   }
// });

// router.get('/workers', (req, res) => {
//   // fetch thisUser and render game
//   try {
//     res.render(path.join(import.meta.dirname + "/render/workers.pug"), {
//       user: thisUser,
//       isSignedIn: true,
//       showUserInNav: false,
//       hasAlphaAccess: thisUser.access.alpha ?? false,
//       isAdmin: thisUser.access.admin ?? false,
//       config: config
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("An error occurred while rendering the page.");
//   }
// });
// router.get('/workers/test', (req, res) => {
//   // fetch thisUser and render game
//   try {
//     res.render(path.join(import.meta.dirname + "/render/workers_test.pug"), {
//       user: thisUser,
//       isSignedIn: true,
//       showUserInNav: false,
//       hasAlphaAccess: thisUser.access.alpha ?? false,
//       isAdmin: thisUser.access.admin ?? false,
//       config: config
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("An error occurred while rendering the page.");
//   }
// });

router.get('/backpack', (req, res) => {
  // fetch thisUser and render game
  try {
    res.render("backpack.pug", {
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
router.get('/backpack/test', (req, res) => {
  // fetch thisUser and render game
  res.render("backpack_test.pug", {
    user: thisUser,
    isSignedIn: true,
    showUserInNav: false,
    hasAlphaAccess: thisUser.access.alpha ?? false,
    isAdmin: thisUser.access.admin ?? false,
    config: config
  });
});

// router.get('/wheel', (req, res) => {
//   // fetch thisUser and render game
//   res.render(path.join(import.meta.dirname + "/render/wheel.pug"), {
//     user: thisUser,
//     isSignedIn: true,
//     showUserInNav: false,
//     hasAlphaAccess: thisUser.access.alpha ?? false,
//     isAdmin: thisUser.access.admin ?? false,
//     config: config
//   });
// });
// router.get('/wheel/test', (req, res) => {
//   // fetch thisUser and render game
//   res.render(path.join(import.meta.dirname + "/render/wheel_test.pug"), {
//     user: thisUser,
//     isSignedIn: true,
//     showUserInNav: false,
//     hasAlphaAccess: thisUser.access.alpha ?? false,
//     isAdmin: thisUser.access.admin ?? false,
//     config: config
//   });
// });

let package_ours = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, '../package.json'), 'utf8'));

router.get('/help-about', (req, res) => {
  // fetch thisUser and render game
  res.render("about.pug", {
    user: thisUser,
    isSignedIn: true,
    showUserInNav: false,
    hasAlphaAccess: thisUser.access.alpha ?? false,
    isAdmin: thisUser.access.admin ?? false,
    config: config,
    version: package_ours.version,
  });
});
// router.get('/help-about/test', (req, res) => {
//   // fetch thisUser and render game
//   res.render(path.join(import.meta.dirname + "/render/help-about_test.pug"), {
//     user: thisUser,
//     isSignedIn: true,
//     showUserInNav: false,
//     hasAlphaAccess: thisUser.access.alpha ?? false,
//     isAdmin: thisUser.access.admin ?? false,
//     config: config
//   });
// });

router.get('/achievements', (req, res) => {
  res.render("achievements.pug", {
      user: thisUser,
      isSignedIn: true,
      showUserInNav: false,
      hasAlphaAccess: thisUser.access.alpha ?? false,
      isAdmin: thisUser.access.admin ?? false,
      config: config,
      version: package_ours.version,
  });
});
router.get('/achievements/test', (req, res) => {
  res.render("achievements_test.pug", {
      user: thisUser,
      isSignedIn: true,
      showUserInNav: false,
      hasAlphaAccess: thisUser.access.alpha ?? false,
      isAdmin: thisUser.access.admin ?? false,
      config: config,
      version: package_ours.version,
  });
});

router.get('/friends', (req, res) => {
  // fetch thisUser and render game
  res.render("friends.pug", {
    user: thisUser,
    isSignedIn: true,
    showUserInNav: false,
    hasAlphaAccess: thisUser.access.alpha ?? false,
    isAdmin: thisUser.access.admin ?? false,
    config: config
  });
});

router.use('/api/:endpoint', async (req, res) => {
  console.log(req.body);
  await apiSocket(`${req.params.endpoint}`, {
    auth: thisToken,
    body: req.body
  }, req.method, req, res);
});

router.use((req, res) => {
  res.status(404).sendFile(path.join(import.meta.dirname, '/404.html'));
});

export default router;