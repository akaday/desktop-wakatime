import type { AppData } from "../helpers/apps-manager";
import { AppsManager } from "../helpers/apps-manager";
import { Logger } from "../helpers/logger";

export class Wakatime {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  private shouldSendHeartbeat(app: AppData) {
    const isMonitored = AppsManager.isMonitoredApp(app);
    if (!isMonitored) {
      return false;
    }
    return true;
  }

  async sendHeartbeat(
    app: AppData,
    _windowInfo?: {
      title?: string;
      url?: string;
      processId?: number;
    },
  ) {
    if (!this.shouldSendHeartbeat(app)) {
      return;
    }
    console.log("Send Heartbeat: " + app.name);
  }
}