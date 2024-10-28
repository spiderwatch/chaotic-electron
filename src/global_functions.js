import { Notification } from 'electron';
import { thisIcon } from './index.js';
import loadGameWindow from './winConfig/game.js';
import { gameWindow } from './winConfig/game.js';


export function newNotification(title, body){
    let notification = new Notification({
        title: title,
        body: body,
        icon: thisIcon
    });

    notification.on('click', () => {
        if (!gameWindow || gameWindow === null) {
            loadGameWindow();
        } else {
            gameWindow.show();
            gameWindow.focus();
        }
    });
    notification.show();
}

