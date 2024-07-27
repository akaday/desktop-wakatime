import { contextBridge, ipcRenderer } from "electron";

import {
  GET_APP_VERSION_IPC_KEY,
  GET_INSTALLED_APPS_IPC_KEY,
  GET_SETTING_IPC_KEY,
  IS_MONITORED_KEY,
  SET_MONITORED_KEY,
  SET_SETTING_IPC_KEY,
} from "./utils/constants";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args),
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  sendSync(...args: Parameters<typeof ipcRenderer.sendSync>) {
    const [channel, ...omit] = args;
    return ipcRenderer.sendSync(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
  getSetting(section: string, key: string, internal = false) {
    return ipcRenderer.sendSync(GET_SETTING_IPC_KEY, section, key, internal);
  },
  setSetting(section: string, key: string, value: string, internal = false) {
    ipcRenderer.send(SET_SETTING_IPC_KEY, section, key, value, internal);
  },
  isMonitored(path: string) {
    return ipcRenderer.sendSync(IS_MONITORED_KEY, path);
  },
  setMonitored(path: string, monitor: boolean) {
    ipcRenderer.send(SET_MONITORED_KEY, path, monitor);
  },
  getInstalledApps() {
    return ipcRenderer.sendSync(GET_INSTALLED_APPS_IPC_KEY);
  },
  getAppVersion() {
    return ipcRenderer.sendSync(GET_APP_VERSION_IPC_KEY);
  },
  shouldLaunchOnLogIn() {
    return ipcRenderer.sendSync("should_launch_on_login");
  },
  setShouldLaunchOnLogIn(shouldLaunchOnLogIn: boolean) {
    ipcRenderer.send("set_should_launch_on_login", shouldLaunchOnLogIn);
  },
  shouldLogToFile() {
    return ipcRenderer.sendSync("should_log_to_file");
  },
  setShouldLogToFile(shouldLogToFile: boolean) {
    ipcRenderer.send("set_should_log_to_file", shouldLogToFile);
  },
});
