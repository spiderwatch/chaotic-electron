import packageInfo from './package.json';
import { contextBridge, ipcRenderer } from 'electron/renderer';


contextBridge.exposeInMainWorld('electronAPI', {
    echo: async (msg) => {
        console.log("Renderer: " + msg);
        console.log("Sending to Main");
        const response = await ipcRenderer.invoke('echo', msg);
        console.log("Main: " + response);
        return response;
    },
    getVersion: () => {
        return packageInfo.version;
    },
    serverReq: async (msg) => {
        console.log("Renderer: " + msg);
        console.log("Sending to Main");
        const response = await ipcRenderer.invoke('serverReq', msg);
        console.log("Main: " + response);
        return response;
    }
});

// handle when the server sends a message to the client

ipcRenderer.on('serverConnected', () => {
    console.log("Server connected");
    statusEvents.serverConnected = true;
    // emit an event to the client
    window.dispatchEvent(new Event('serverConnected'));
});
