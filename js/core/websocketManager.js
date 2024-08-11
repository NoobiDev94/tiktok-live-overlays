export class WebSocketManager {
  constructor(url, messageHandler) {
    this.url = url;
    this.websocket = null;
    this.messageHandler = messageHandler;
  }

  connect() {
  
    try {
        if (this.websocket) return;
        this.websocket = new WebSocket(this.url);
        
        this.websocket.onopen = () => {
            this.messageHandler.onOpen();
            document.getElementById("status").innerText = "Connected";
        };
    
        this.websocket.onclose = () => {
            document.getElementById("status").innerText = "Disconnected";
            this.websocket = null;
            setTimeout(() => this.connect(), 1000);
        };
    
        this.websocket.onerror = () => {
            document.getElementById("status").innerText = "Connection Failed";
            this.websocket = null;
            setTimeout(() => this.connect(), 1000);
        };
    
        this.websocket.onmessage = async (event) => {
            const parsedData = JSON.parse(event.data);
            this.messageHandler.handleMessage(parsedData);
        };
    } 
    catch (error) {
        console.log("Failed: ", error)
    }
    

  }
}
