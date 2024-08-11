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

        let {uniqueId, nickname, createTime, followRole, comment} = parsedData.data
        let profilePictureUrl = parsedData.data.userDetails?.profilePictureUrls[3];

        switch (parsedData.event) {
            case "chat":
                newMessage(uniqueId, nickname, profilePictureUrl, comment, followRole, createTime)
                break;
            case "like":
                console.log("Like recebido")
                break;
            case "share":
                console.log("Nova mensagem")
                break;
            case "follow":
                newEvent("follow", uniqueId, nickname, profilePictureUrl, createTime, "Seguiu a live!")
                break;
            case "gift":
                let {giftAmount} = parsedData.data
                console.log("Novo Gift")
                break;
            case "subscribe":
                console.log("Novo Subscriber")
                break;
        }

        console.log("Data received", parsedData);
    };
}

window.addEventListener('load', connect);

function newMessage(userName, userDisplay, userPicture, messageContent, userRelation, messageTime) {
    let chatLog = document.getElementById("chatLog");
    let newMessage = document.createElement("div");

    const time = new Date(Number(messageTime));
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');

    newMessage.innerHTML = `
        <a href="https://tiktok.com/@${userName}">
        <div id="messageItem" class="relation-${userRelation}">
            <div id="messageUser">
                <div id="messageTime">${hours}:${minutes}</div>
                <div id="userPicture" style="background-image: url('${userPicture}')"></div>
                <div id="userDisplay">${userDisplay}</div>
                <div id="userUsername">@${userName}</div>
            </div>
            <div id="messageContent">${messageContent}</div>
        </div>
        </a>
    `;

    chatLog.appendChild(newMessage);
}

function newEvent(eventType, userName, userDisplay, userPicture, messageTime, eventMessage) {
    let chatLog = document.getElementById("chatLog");
    let newMessage = document.createElement("div");

    const time = new Date(Number(messageTime));
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');

    newMessage.innerHTML = `
        <a href="https://tiktok.com/@${userName}">
        <div id="eventItem" class="event-${eventType}">
            <div id="messageUser">
                <div id="messageTime">${hours}:${minutes}</div>
                <div id="userPicture" style="background-image: url('${userPicture}')"></div>
                <div id="userDisplay">${userDisplay}</div>
                <div id="userUsername">@${userName}</div>
            </div>
            <div id="eventMessage">${eventMessage}</div>
        </div>
        </a>
    `;

    chatLog.appendChild(newMessage);
}

// Debug buttons for testing
function debugFunction() {
    if (type === "teste") {
        
    }
}