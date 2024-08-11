export class ChatMonitor {
  processMessage(data) {
    let {uniqueId, nickname, createTime, followRole, comment} = data
    let profilePictureUrl = parsedData.data.userDetails?.profilePictureUrls[3];
    this.newMessage(uniqueId, nickname, profilePictureUrl, comment, followRole, createTime);
  }

  newMessage(userName, userDisplay, userPicture, messageContent, userRelation, messageTime) {
    let chatLog = document.getElementById("chatLog");
    let newMessage = document.createElement("div");

    const time = new Date(Number(messageTime));
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");

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
}
