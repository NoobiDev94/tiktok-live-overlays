let websocket = null;

// Settings
let refreshInterval = 60; // seconds

// Stats
let tiktokViewers = 0;
let tiktokMembersJoined = 0;
let tiktokMessages = 0;
let tiktokFollows = 0;
let tiktokLikes = 0;
let tiktokShares = 0;
let tiktokGifts = 0;
let tiktokGiftsQuantity = 0;
let tiktokSubscribers = 0;

// Connection with the local bot
const client = new StreamerbotClient({
    onConnect: onConnect,
    onDisconnect: onDisconnect
});

// Receives Twitch messages for the dashboard
async function onConnect(instance) {
    client.on('Twitch.ChatMessage', (data) => {
        let twitchUsername = data.data.message.username;
        let twitchDisplayName = data.data.message.displayName;
        let twitchMessage = data.data.message.message;

        newMessage("Twitch", twitchUsername, twitchDisplayName, "", twitchMessage);
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
        document.getElementById("status").innerText = "Connected";
    };

    websocket.onclose = function () {
        document.getElementById("status").innerText = "Disconnected";
        websocket = null;
        setTimeout(connect, 1000);
    };

    websocket.onerror = function () {
        document.getElementById("status").innerText = "Connection Failed";
        websocket = null;
        setTimeout(connect, 1000);
    };

    websocket.onmessage = async function (event) {
        let parsedData = JSON.parse(event.data);

        if (parsedData.event === "roomUser") {
            // Sets the Viewers to the current watching
            tiktokViewers = parsedData.data.viewerCount;

        } else if (parsedData.event === "like") {
            // Sets the Likes quantity to the total received
            tiktokLikes = parsedData.data.totalLikeCount;

        } else if (parsedData.event === "share") {
            // Increments the Shares quantity for the session
            tiktokShares += 1;

        } else if (parsedData.event === "chat") {
            // Parse the variables to be easier to read
            let tiktokUsername = parsedData.data.uniqueId;
            let tiktokDisplayName = parsedData.data.nickname;
            let tiktokMessage = parsedData.data.comment;
            let tiktokProfilePicture = parsedData.data.userDetails.profilePictureUrls[3];

            // Increments the Messages quantity for the session
            tiktokMessages += 1;

            newMessage("TikTok", tiktokUsername, tiktokDisplayName, tiktokProfilePicture, tiktokMessage);

        } else if (parsedData.event === "member") {
            // Increments the Members Joined quantity for the session
            tiktokMembersJoined += 1;

        } else if (parsedData.event === "follow") {
            // Parse the variables to be easier to read
            let tiktokUsername = parsedData.data.uniqueId;
            let tiktokDisplayName = parsedData.data.nickname;
            let tiktokProfilePicture = parsedData.data.userDetails.profilePictureUrls[3];

            // Increments the Follower quantity for the session
            tiktokFollows += 1;

            alertFollower(tiktokUsername, tiktokDisplayName, tiktokProfilePicture);

        } else if (parsedData.event === "gift") {
            // Parse the variables to be easier to read
            let tiktokUsername = parsedData.data.uniqueId;
            let tiktokDisplayName = parsedData.data.nickname;
            let tiktokProfilePicture = parsedData.data.userDetails.profilePictureUrls[2];
            let giftAmount = parsedData.data.gift.repeat_count;
            let giftType = parsedData.data.giftName;
            let giftIcon = parsedData.data.giftPictureUrl;

            // Increments the Gift quantity for the session
            tiktokGifts += 1;
            tiktokGiftsQuantity += giftAmount;

            alertGifts(tiktokUsername, tiktokDisplayName, tiktokProfilePicture, giftAmount, giftType, giftIcon);

        } else if (parsedData.event === "subscribe") {
            // Parse the variables to be easier to read
            let tiktokUsername = parsedData.data.uniqueId;
            let tiktokDisplayName = parsedData.data.nickname;
            let tiktokProfilePicture = parsedData.data.userDetails.profilePictureUrls[3];

            // Increments the Subscriber quantity for the session
            tiktokSubscribers += 1;

            alertFollower(tiktokUsername, tiktokDisplayName, tiktokProfilePicture);
        }

        console.log("Data received", parsedData);
    };
}

window.addEventListener('load', connect);

// Handles new messages received and add to the chat log
function newMessage(platform, userName, userDisplay, profilePicture, message) {
    let chatLog = document.getElementById("messageLog");
    let newMessage = document.createElement("div");

    newMessage.innerHTML = `
        [${platform}] ${userDisplay} (@${userName}): ${message}
    `;

    chatLog.appendChild(newMessage);
}

// Runs the update function every X seconds
setInterval(updateTikTokStats, refreshInterval * 1000);

async function updateTikTokStats() {
    console.table([{ Viewers: tiktokViewers, Members: tiktokMembersJoined, Messages: tiktokMessages, Shares: tiktokShares, Gifts: tiktokGifts, GiftsTotal: tiktokGiftsQuantity, Subscribers: tiktokSubscribers }]);

    await client.doAction("f0a25f61-1d65-44ce-a53b-17669460c991", {
        Viewers: tiktokViewers,
        Messages: tiktokMessages,
        Members: tiktokMembersJoined,
        Likes: tiktokLikes,
        Shares: tiktokShares,
        Follows: tiktokFollows,
        Gifts: tiktokGifts,
        GiftsQuantity: tiktokGiftsQuantity,
        Subscribers: tiktokSubscribers
    });
}

// Handle the events for new followers
async function alertFollower(userName, userDisplay, profilePicture) {
    console.log("New Follower! " + userDisplay);

    await client.doAction("db934b86-557b-4cb2-8c8c-f5d4a5466829", {
        uniqueId: userName,
        nickname: userDisplay,
        profilePictureUrl: profilePicture
    });
}

// Handle the events for new subscriber
async function alertSubscriber(userName, userDisplay, profilePicture, subscriberMonths) {
    console.log("New Subscriber! " + userDisplay);

    await client.doAction("95c7173b-6aab-4cfb-ae9d-ab8b5b540567", {
        uniqueId: userName,
        nickname: userDisplay,
        profilePictureUrl: profilePicture,
        subMonth: subscriberMonths
    });
}

// Handle the events for new gift received
async function alertGifts(userName, userDisplay, profilePicture, giftAmount, giftType, giftIcon) {
    console.log("New Gift! " + userDisplay + "(" + userName + ") sent " + giftAmount + "x " + giftType)

    // Shows latest gifter
    document.getElementById('giftIcon').style.backgroundImage = `url(${giftIcon})`;
    document.getElementById('giftInfo').textContent = userDisplay + "(" + userName + ") sent " + giftAmount + "x " + giftType;

    // Trigger the flashbang using gift amount as timer (1~10)
    await client.doAction("c3d2da16-293a-4fe0-8895-effc71ae292d", {
        tipAmount: giftAmount
    });
}

// Debug buttons for testing
function debugFunction(type, quantity) {
    if (type === "member") {
        tiktokMembersJoined += quantity;
    } else if (type === "chat") {
        tiktokMessages += quantity;
    } else if (type === "follow") {
        tiktokFollows += quantity;
    } else if (type === "share") {
        tiktokShares += quantity;
    } else if (type === "like") {
        tiktokLikes += quantity;
    } else if (type === "gift") {
        tiktokGifts += quantity;
        tiktokGiftsQuantity += quantity * 2;
    } else if (type === "subscriber") {
        tiktokSubscribers += quantity;
    } else if (type === "reset") {
        tiktokMembersJoined = quantity;
        tiktokMessages = quantity;
        tiktokFollows = quantity;
        tiktokShares = quantity;
        tiktokLikes = quantity;
        tiktokGifts = quantity;
        tiktokGiftsQuantity = quantity;
        tiktokSubscribers = quantity;
    }
}