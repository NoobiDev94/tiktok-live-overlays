import { TikTokHandler } from "../modules/tiktok/handler.js";

export class handlerManager {
  setHandler(key) {
    switch (key) {
      case 1:
        const tiktokHandler = new TikTokHandler();
        console.log("Selected TikTok instance")
        return tiktokHandler;
      case 2:
        console.log("Selected Twitch instance")
        return null;
      case 3:
        console.log("Selected Orkut instance")
        return null;
    }
  }
}
