import { WebSocketManager } from "./core/websocketManager.js";
import { SessionStorageManager } from "./core/authManager.js";
import { handlerManager } from "./core/handlerManager.js";

const storageManager = new SessionStorageManager();
const handler = new handlerManager();

function selectInstance(index) {
  storageManager.setItem("instance", index);
  connectInstance(index);
}

/* Deprecated
function debugFunction(type, quantity) {
  console.log("cheguei no debug")
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
} */

function connectInstance(index) {
  let usingHandler = handler.setHandler(parseInt(index));
  //const wsManager = new WebSocketManager("ws://localhost:21213/", usingHandler);
  //wsManager.connect();

  const instanceDiv = document.getElementById("instance");
  instanceDiv.style.display = "block"; 

  const selectInstanceDiv = document.getElementById("selectInstance");
  selectInstanceDiv.style.display = "none"; 
}

window.onload = function () {
    

  const instance = storageManager.getItem("instance");
  instance ? connectInstance(instance) : null;

  const debugButtons = document.querySelectorAll(".debugInterface");
  debugButtons.forEach(buttonDebug => {
    buttonDebug.addEventListener("click", function () {
      const typeDebug = buttonDebug.getAttribute("data-debugType");
      const valueDebug = buttonDebug.getAttribute("data-debugValue");
      debugFunction(typeDebug, valueDebug);
    });
  });


  const buttonsInstance = document.querySelectorAll(".instanceSelect");
  buttonsInstance.forEach(buttonInstance => {
    buttonInstance.addEventListener("click", function () {
      const instance = buttonInstance.getAttribute("data-instance");
      selectInstance(instance);
    });
  });


  console.log("All resources loaded");

};
