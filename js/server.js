import { WebSocketManager } from "./core/websocketManager.js";
import { SessionStorageManager } from "./core/authManager.js";
import { handlerManager } from "./core/handlerManager.js";

const storageManager = new SessionStorageManager();
const handler = new handlerManager();

function selectInstance(index) {
  storageManager.setItem("instance", index);
  connectInstance(index);
}

function connectInstance(index) {
  let usingHandler = handler.setHandler(parseInt(index));
  const wsManager = new WebSocketManager("ws://localhost:21213/", usingHandler);
  wsManager.connect();

  const instanceDiv = document.getElementById("instance");
  instanceDiv.style.display = "block"; 

  const selectInstanceDiv = document.getElementById("selectInstance");
  selectInstanceDiv.style.display = "none"; 
}

window.onload = function () {
    

  const instance = storageManager.getItem("instance");
  instance ? connectInstance(instance) : null;

  const button = document.getElementById("instanceSelect");
  button.addEventListener("click", function () {
    const message = button.getAttribute("data-instance");
    selectInstance(message);
  });

  console.log("All resources loaded");

};
