let websocket = null;

// Stats
let tiktokFollows = 0;
let tiktokGifts = 0;
let tiktokGiftsQuantity = 0;
let tiktokSubscribers = 0;

// Goals
let tiktokGoalFollows = 100;
let tiktokGoalGifts = 100;

// Connection with the local bot
const client = new StreamerbotClient({
    onConnect: onConnect,
    onDisconnect: onDisconnect
});

// Receives Twitch messages for the dashboard
async function onConnect(instance) {
    client.on('Event.Type', (data) => {

    });
}

function onDisconnect(instance) {
    console.log("Disconnected from StreamerBot");
}

// Connection with TikFinity
function connect() {
    if (websocket) return;

    websocket = new WebSocket("ws://localhost:21213/");

    websocket.onopen = function () {
        tiktokGoals();
    };

    websocket.onclose = function () {
        websocket = null;
        setTimeout(connect, 1000);
    };

    websocket.onerror = function () {
        websocket = null;
        setTimeout(connect, 1000);
    };

    websocket.onmessage = async function (event) {
        let parsedData = JSON.parse(event.data);

        if (parsedData.event === "follow") {
            // Increments the Follower quantity for the session
            tiktokFollows += 1;

            tiktokGoals();

        } else if (parsedData.event === "gift") {
            // Parse the variables to be easier to read
            let giftAmount = parsedData.data.gift.repeat_count;

            // Increments the Gift quantity for the session
            tiktokGifts += 1;
            tiktokGiftsQuantity += giftAmount;

            tiktokGoals();

        } else if (parsedData.event === "subscribe") {
            // Increments the Subscriber quantity for the session
            tiktokSubscribers += 1;

            tiktokGoals();
        }
    };
}

window.addEventListener('load', connect);

// Updates the TikTok Goals
function tiktokGoals() {
    // FOLLOWER GOAL
    // Updates the text for the goal
    document.getElementById('goalFollowPercent').textContent = Math.round((tiktokFollows / tiktokGoalFollows) * 100) + "%";
    document.getElementById('goalFollowCurrent').textContent = tiktokFollows;
    document.getElementById('goalFollowTarget').textContent = tiktokGoalFollows;

    // Updates the bar fill
    document.getElementById('goalFollowBarFill').style.width = (tiktokFollows / tiktokGoalFollows) * 100 + "%";

    // GIFT GOAL (Based on quantity received)
    // Updates the text for the goal
    document.getElementById('goalGiftPercent').textContent = (tiktokGiftsQuantity / tiktokGoalGifts) * 100 + "%";
    document.getElementById('goalGiftCurrent').textContent = tiktokGiftsQuantity;
    document.getElementById('goalGiftTarget').textContent = tiktokGoalGifts;

    // Updates the bar fill
    document.getElementById('goalGiftBarFill').style.width = (tiktokGiftsQuantity / tiktokGoalGifts) * 100 + "%";
}