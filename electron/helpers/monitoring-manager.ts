import { getDesktopWakaTimeConfigFilePath } from "../utils";
import { AppsManager } from "./apps-manager";
import { ConfigFileReader } from "./config-file-reader";

export abstract class MonitoringManager {
  static isBrowserMonitored() {
    const allApps = AppsManager.getApps();
    const browserApps = allApps.filter((app) => app.isBrowser);
    return browserApps.findIndex((app) => this.isMonitored(app.path)) !== -1;
  }

  static isMonitored(path: string) {
    if (!AppsManager.getApp(path)) {
      return;
    }
    const monitoringKey = this.monitoredKey(path);
    const file = getDesktopWakaTimeConfigFilePath();
    const monitoring = ConfigFileReader.getBool(
      file,
      "monitoring",
      monitoringKey,
    );
    if (monitoring === null) {
      ConfigFileReader.setBool(file, "monitoring", monitoringKey, false);
      return false;
    }
    return monitoring;
  }

  static set(path: string, monitor: boolean) {
    if (!AppsManager.getApp(path)) {
      return;
    }
    const file = getDesktopWakaTimeConfigFilePath();
    const monitoringKey = this.monitoredKey(path);
    ConfigFileReader.setBool(file, "monitoring", monitoringKey, monitor);
  }

  static monitoredKey(path: string) {
    return `is_${path}_monitored`;
  }
}
