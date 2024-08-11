import { ChatMonitor } from './chatMonitor.js';
import { GoalsMonitor } from './goalsMonitor.js';
import { GiftsMonitor } from './giftsMonitor.js';

export class TikTokHandler {
    constructor() {
        this.chatMonitor = new ChatMonitor();
        this.goalsMonitor = new GoalsMonitor();
        this.giftsMonitor = new GiftsMonitor();
    }

    handleMessage(parsedData) {
        switch (parsedData.event) {
            case "chat":
                this.chatMonitor.processMessage(parsedData.data);
                break;
            case "like":
                this.goalsMonitor.updateLikes(parsedData.data.totalLikeCount);
                break;
            case "gift":
                this.giftsMonitor.processGift(parsedData.data);
                break;
            // Anything
            default:
                console.log("Unhandled event:", parsedData.event);
        }
    }
}