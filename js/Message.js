class Message {
    constructor(username, photo, user, type, content, currentTime) {
      this.username = username;
      this.photo = photo;
      this.user = user;
      this.type = type;
      this.content = content;
      this.currentTime = currentTime;
      this.chat = document.querySelector('#chat-box');
    }
  
    getMessage() {

      let messageContent = "";

      if(this.user == "person") {
        this.chat.innerHTML += `
          <div class="chat right">
              <p>${this.content}</p>
              <img class="bot-img" src="${this.photo}" alt="image de profil">
          </div>
          <small class="small-chat right">${this.username} - ${this.currentTime}</small>
        `;
        return;
      }
  
      if(this.user == "bot" && this.type == "text") {
        messageContent += `
        <div class="chat left">
          <img class="bot-img" src="${this.photo}" alt="image de profil">
          <p>${this.content}</p>
        </div>
        <small class="small-chat left">${this.username} - ${this.currentTime}</small>
        `;
      }
  
      if(this.user == "bot" && this.type == "img") {
        messageContent += `
          <div class="chat left chat-img">
            <img class="bot-img" src="${this.photo}" alt="image de profil">
            <img class="img-msg img-load" src="${this.content}">
          </div>
          <small class="small-chat left small-img">${this.username} - ${this.currentTime}</small>
        `;
      }
  
      if(this.user == "bot" && this.type == "comments youtube") {
        messageContent += `
          <div class="chat left">
            <img class="bot-img" src="${this.photo}" alt="image de profil">
            <p>Voici les 3 premiers commentaires sous cette vidéo :</p>
          </div>
          <div class="chat-ytb-comments left">
            ${this.content}
          </div>
          <small class="small-chat left small-img">${this.username} - ${this.currentTime}</small>
        `;
      }
  
      if(this.user == "bot" && this.type == "video youtube") {
        messageContent += `
          <div class="chat left">
            <img class="bot-img" src="${this.photo}" alt="image de profil">
            <p>Voici les 3 premières vidéo de cette recherche :</p>
          </div>
          <div class="chat-ytb-comments left">
            ${this.content}
          </div>
          <small class="small-chat left small-img">${this.username} - ${this.currentTime}</small>
        `;
      }
  
      if(this.user == "bot" && this.type == "meteo") {
        messageContent += `
          <div class="chat left">
            <img class="bot-img" src="${this.photo}" alt="image de profil">
            <div class="meteo-content">
              ${this.content}
            </div>
          </div>
          <small class="small-chat left small-img">${this.username} - ${this.currentTime}</small>
        `;
      }

      this.chat.innerHTML += messageContent;

      return;

    }
}