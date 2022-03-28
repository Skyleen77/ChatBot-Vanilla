class ChatBot {
    constructor() {
      this.saluer = ['Hey', 'Salut', 'Bonjour', 'Hi'];
      this.bots = [
        new Bot(
          'Helper',
          `Je t'aide à connaître les commandes, tape "Help" pour connaître la liste des commandes :)`,
          'img/bot_help.png',
          [
            new Command(
              'Help',
              `Bonjour, je suis Helper, le bot qui te permet de connaître toutes les commandes.<br>
              Taper "Help" pour avoir la liste de toutes les commandes disponibles.
              <br><br><strong>Voici la liste des commandes disponibles :</strong>`,
              'text'
            )
        ]),
        new Bot('Cat', `J'aime bien les chats`, 'img/bot_cat.png', [
          new Command(
            'Date',
            `Taper "Date" pour avoir l'heure actuelle`,
            'text',
            `${new Date().toLocaleDateString('fr', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour:"numeric", minute:"numeric", second:"numeric"})} chez les chats`
          ),
          new Command('Les chats', `Taper "Les chats" pour savoir ce que le bot pense des chats`, 'text', `J'aime les chats !`),
          new Command('Chat', `Taper "Chat" pour avoir une photo ou un gif de chat aléatoire`, 'api')
        ]),
        new Bot('Youtubot', 'Youtube est la meilleure plateforme de vidéos !', 'img/youtube.png', [
          new Command(
            'Youtube Comments',
            `Taper "Youtube Comments + l'id de la vidéo" pour les trois premiers commentaires de la vidéo en question (la requête peut prendre quelques secondes)`,
            'api',
          ),
          new Command(
            'Youtube Description',
            `Taper "Youtube Description" pour savoir ce qu'est youtube`,
            'text',
            'Youtube est un site web d’hébergement de vidéos et un média social sur lequel les utilisateurs peuvent envoyer, regarder, commenter, évaluer et partager des vidéos en streaming.'
          ),
          new Command(
            'Youtube Vidéo',
            `Taper "Youtube Vidéo + votre recherche" pour l'afficher ici (la requête peut prendre quelques secondes)`,
            'api',
          )
        ]),
        new Bot('Talk', `Je m'ennuie, parle moi !`, 'img/bot_talk.png', [
          new Command('Salut', `Taper "Salut" pour saluer le bot`, 'text'),
          new Command('Bonjour', `Taper "Bonjour" pour saluer le bot`, 'text'),
          new Command('Hi', `Taper "Hi" pour saluer le bot`, 'text'),
          new Command('Hey', `Taper "Hey" pour saluer le bot`, 'text'),
          new Command('Comment allez-vous ?', `Taper "Comment allez-vous ?" pour savoir comment va le bot`, 'text', 'Bien et vous ?'),
          new Command('Bien', `Taper "Bien" pour dire au bot que vous allez bien`, 'text', 'Tant mieux !'),
          new Command('Mal', `Taper "Mal" pour dire au bot que vous allez mal`, 'text', 'Mince...'),
          new Command('Bof', `Taper "Bof" pour dire au bot que vous allez moyennement`, 'text', `Oh c'est bête`),
          new Command('Météo', `Taper "Météo + le nom de votre ville" pour connaître la météo (la requête peut prendre quelques secondes)`, 'api')
        ])
      ];
  
      this.el = document.querySelector('#app');
      this.chatContent = document.querySelector('#chat-box');
  
      this.run();
    }
  
    toBottom() {
      setTimeout(() => {
        window.scrollTo(0,this.chatContent.scrollHeight);
      }, 1000);
    }
  
    getLocalStorageLength() {
      let values = [];
      let keys = Object.keys(localStorage);
      let i = keys.length;
  
      while ( i-- ) {
        if (keys[i].match(/^message/)) {
          values.push( localStorage.getItem(keys[i]) );
        }
      }
  
      return values;
    }
  
    getMenu() {
      const collapse = document.getElementById('check');
  
      collapse.addEventListener('click', () => {
  
        const sidebar = document.querySelector('#sidebar');
        const content = document.querySelector('#content');
        const formSend = document.querySelector('#input-chat');
        const listMessages = document.querySelector('#chat-box');
  
        listMessages.classList.toggle('active')
        formSend.classList.toggle('active');
        sidebar.classList.toggle('active');
        content.classList.toggle('active');

        if(window.matchMedia("(max-width:768px)").matches) {
          this.toBottom();
        }
      });
    }
  
    getSidebar() {
      const list = document.querySelector('#list-bots');

      let affichageBots = "";
  
      for(let i = 0; i < this.bots.length; i += 1) {
        affichageBots += `
        <li>
            <div class="row">
                <div class="col-3">
                    <img class="bot-img" src="${this.bots[i].photo}" alt="image de profil">
                </div>
                <div class="col-8 bot-info">
                    <div class="bot-name">${this.bots[i].name}</div>
                    <div class="bot-intro">${this.bots[i].intro}</div>
                </div>
            </div>
        </li>
        `;
      }

      list.innerHTML = affichageBots;
      
    }
  
    getCommands() {
      let commands = '';
      for(let k = 0; k < this.bots.length; k += 1) {
        if(k >= 1) {
          commands += '<br>';
        }
        commands += `<strong>${this.bots[k].name}</strong><br>`;
        for(let l = 0; l < this.bots[k].commands.length; l += 1) {
          commands += `${this.bots[k].commands[l].description}<br>`;
        }
      }
      return commands;
    }
  
    render() {
  
      // message answer of the bot
      const sendBotMessage = (username, photo, reply) => {
        setTimeout(() =>
        {
          let count = this.getLocalStorageLength().length;
          const currentTime = new Date().toLocaleDateString('fr', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour:"numeric", minute:"numeric", second:"numeric"});
          
          // put in the local storage
          let messageContent = {
            username: username,
            photo: photo,
            user: 'bot',
            type: 'text',
            message: `${reply}`,
            currentTime: currentTime
          }
          let message = JSON.stringify(messageContent);
          localStorage.setItem(`message${count}`, message);
            
          // add the message 
          const apiMessage = new Message(`${messageContent.username}`, `${messageContent.photo}`, `${messageContent.user}`, `${messageContent.type}`, `${messageContent.message}`, `${currentTime}`);
          apiMessage.getMessage();
  
          setTimeout(this.toBottom(), 1000);
        }, 1000);
      }
  
      // api answer of the bot
      const sendBotApi = (username, photo, api, content) => {
  
        if(api === 'Météo') {
          setTimeout(() =>
          {
  
            // count the number of message stored for name it
            let count = this.getLocalStorageLength().length;
            
            const meteo = content; // Passez le nom de la ville ou du pays.
  
            // take the API
            fetch(`http://api.weatherapi.com/v1/current.json?key=c8bbed0d1c8b44c5baa173120210112&q=${meteo}&aqi=no&lang=fr`)
              .then(res => res.json())
              .then((data) => {
  
                if(data.error === undefined) {
  
                  const currentTime = new Date().toLocaleDateString('fr', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour:"numeric", minute:"numeric", second:"numeric"});
  
                  let dateUpdate = new Date(data.current.last_updated).toLocaleDateString('fr', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour:"numeric", minute:"numeric"});;
                  
                  let contentMessage = `
                    <p class="text-meteo">${data.current.condition.text},
                    il fait ${data.current.temp_c}°C, ressentie ${data.current.feelslike_c}°C.<br>
                    Le vent souffle à une vitesse de ${data.current.wind_kph} km/h.<br>
                    L'indice uv est de ${data.current.uv} sur 10.<br>
                    Le taux d'humidité est de ${data.current.humidity}% et la visibilité est de ${data.current.vis_km} km.<br>
                    (Dernière mis à jour : ${dateUpdate})</p>
                  `;
  
                  // put in the local storage
                  let messageContent = {
                    username: username,
                    photo: photo,
                    user: 'bot',
                    type: 'meteo',
                    message: `${contentMessage}`,
                    currentTime: currentTime
                  }
                  let message = JSON.stringify(messageContent);
                  localStorage.setItem(`message${count}`, message);
  
                  // add the message
                  const apiMessage = new Message(`${messageContent.username}`, `${messageContent.photo}`, `${messageContent.user}`, `${messageContent.type}`, `${messageContent.message}`, `${currentTime}`);
                  apiMessage.getMessage();
  
                } else {
  
                  sendBotMessage(username, photo, 'Aucune ville ne correspond :/');
  
                }
              })
              
              setTimeout(this.toBottom(), 1000);
          }, 1000);
        }
  
        if(api === 'Chat') {
          setTimeout(() =>
          {
  
            // count the number of message stored for name it
            let count = this.getLocalStorageLength().length;
  
            // take the API
            
            fetch('https://api.thecatapi.com/v1/images/search')
              .then(res => res.json())
              .then((data) => {
  
                const currentTime = new Date().toLocaleDateString('fr', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour:"numeric", minute:"numeric", second:"numeric"});
                // put in the local storage
                let messageContent = {
                  username: username,
                  photo: photo,
                  user: 'bot',
                  type: 'img',
                  message: `${data[0].url}`,
                  currentTime: currentTime
                }
                let message = JSON.stringify(messageContent);
                localStorage.setItem(`message${count}`, message);
  
                // add the message
                const apiMessage = new Message(`${messageContent.username}`, `${messageContent.photo}`, `${messageContent.user}`, `${messageContent.type}`, `${messageContent.message}`, `${currentTime}`);
                apiMessage.getMessage();
              })
              setTimeout(this.toBottom(), 1000);
          }, 1000);
        }
  
        if(api === 'Youtube Comments') {
          setTimeout(() =>
          {
  
            // count the number of message stored for name it
            let count = this.getLocalStorageLength().length;
  
            // take the API
  
            const videoID = content;
            const api_key = "AIzaSyCAujuLgJSOVinvm0_cxFHQPAZe6tyadqI";
            const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&key=${api_key}&videoId=${videoID}&maxResults=3`;
          
            
            fetch(url)
              .then(res => res.json())
              .then((data) => {
  
                if(data.error === undefined) {
                  const theAddMessage = () => {
  
                    let theMessage = "";
  
                    for(let i = 0; i < data.items.length; i += 1)
                    {
                      theMessage += `
                        <div class="ytb-comments">
                          
                            <img class="rounded-circle" src="${data.items[i].snippet.topLevelComment.snippet.authorProfileImageUrl}">
                            <p><a href="${data.items[i].snippet.topLevelComment.snippet.authorChannelUrl}">${data.items[i].snippet.topLevelComment.snippet.authorDisplayName}</a>
                            <br>${data.items[i].snippet.topLevelComment.snippet.textOriginal}</p>
                          
                        </div>
                      `;
                    }
  
                    return theMessage;
                  }
  
                  const currentTime = new Date().toLocaleDateString('fr', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour:"numeric", minute:"numeric", second:"numeric"});
                  // put in the local storage
                  let messageContent = {
                    username: username,
                    photo: photo,
                    user: 'bot',
                    type: 'comments youtube',
                    message: theAddMessage(),
                    currentTime: currentTime
                  }
                  let message = JSON.stringify(messageContent);
                  localStorage.setItem(`message${count}`, message);
  
                  // add the message
                  const apiMessage = new Message(`${messageContent.username}`, `${messageContent.photo}`, `${messageContent.user}`, `${messageContent.type}`, `${messageContent.message}`, `${currentTime}`);
                  apiMessage.getMessage();
                } else {
                  
                  sendBotMessage(username, photo, 'Aucune vidéo ne correspond à cette id :/');
  
                }
                
              })
  
            setTimeout(this.toBottom(), 1000);
          }, 1000);
        }
  
  
        if(api === 'Youtube Vidéo') {
          setTimeout(() =>
          {
  
            // count the number of message stored for name it
            let count = this.getLocalStorageLength().length;
  
            // take the API
  
            const recherche = content;
            const api_key = "AIzaSyCAujuLgJSOVinvm0_cxFHQPAZe6tyadqI";
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${api_key}&q=${recherche}&type=video&maxResults=3`;
  
            fetch(url)
              .then(res => res.json())
              .then((data) => {
  
                if(data.items.length !==  0) {
                  const theAddMessage = () => {
  
                    let theMessage = "";
  
                    for(let i = 0; i < data.items.length; i += 1)
                    {
                      theMessage += `
                        <div class="ytb-comments">
                          
                            <a href="https://www.youtube.com/watch?v=${data.items[0].id.videoId}"><img class="video-ytb-img" src="${data.items[i].snippet.thumbnails.medium.url}"></a>
                            <p><a href="https://www.youtube.com/channel/${data.items[i].snippet.channelId}"><span class="channel-title">${data.items[i].snippet.channelTitle}</span></a>
                            <br><a href="https://www.youtube.com/watch?v=${data.items[0].id.videoId}">${data.items[i].snippet.title}</a>
                            <br>${data.items[i].snippet.description}
                            <br><span class="pulished-video">${data.items[i].snippet.publishedAt}</span></p>
                          
                        </div>
                      `;
                    }
  
                    return theMessage;
                  }
  
                  const currentTime = new Date().toLocaleDateString('fr', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour:"numeric", minute:"numeric", second:"numeric"});
                  // put in the local storage
                  let messageContent = {
                    username: username,
                    photo: photo,
                    user: 'bot',
                    type: 'video youtube',
                    message: theAddMessage(),
                    currentTime: currentTime
                  }
                  let message = JSON.stringify(messageContent);
                  localStorage.setItem(`message${count}`, message);
  
                  // add the message
                  const apiMessage = new Message(`${messageContent.username}`, `${messageContent.photo}`, `${messageContent.user}`, `${messageContent.type}`, `${messageContent.message}`, `${currentTime}`);
                  apiMessage.getMessage();
                } else {
  
                  sendBotMessage(username, photo, 'Aucune vidéo ne correspond à cette recherche :/');
  
                }
  
                
              })
              setTimeout(this.toBottom(), 1000);
          }, 1000);
        }
        
      }
  
  
  
  
      // see messages
      const seeMessages = () => {
        for(let i = 0; i < this.getLocalStorageLength().length; i++){
          let message = localStorage.getItem(`message${i}`);
          let messageContent = JSON.parse(message);
  
          // add the messages
          const allMessages = new Message(`${messageContent.username}`, `${messageContent.photo}`, `${messageContent.user}`, `${messageContent.type}`, `${messageContent.message}`, `${messageContent.currentTime}`);
          allMessages.getMessage();
        }  
  
        // go to the bottom of the screen after displayed messages
        this.toBottom();
      }
  
      // call the fonction to see messages
      seeMessages();
  
  
  
  
  
      // send message
      const form = document.querySelector('.form-send');
  
      form.addEventListener('submit', (e) => {
        if(document.querySelector('#messageToSend').value.trim() != "") {
          e.preventDefault();
          
          let count = this.getLocalStorageLength().length;
          let currentTime = new Date().toLocaleDateString('fr', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour:"numeric", minute:"numeric", second:"numeric"});
  
          let messageContent = {
            username: 'Moi',
            photo: 'img/me.png',
            user: 'person',
            type: 'text',
            message: document.querySelector('#messageToSend').value,
            currentTime: currentTime
          };
          let message = JSON.stringify(messageContent);
  
          localStorage.setItem(`message${count}`, message);
          document.querySelector('#messageToSend').value = "";
  
          // add the message
  
          const sendMessage = new Message(`${messageContent.username}`, `${messageContent.photo}`, `${messageContent.user}`, `${messageContent.type}`, `${messageContent.message}`, `${messageContent.currentTime}`);
          sendMessage.getMessage();
  
          this.toBottom();
  
  
          const wordsWithoutCommand = (words, nbWordCommand) => {
            let allWords = "";
            for(let i = nbWordCommand; i < words.length; i += 1) {
  
              if(i !== words.length - 1) {
                allWords += words[i] + " ";
              } else {
                allWords += words[i];
              }
            
            }
            return allWords;
          }
  
          for(let i = 0; i < this.bots.length; i += 1) {
            for(let j = 0; j < this.bots[i].commands.length; j += 1) {
              
              if(~messageContent.message.indexOf(this.bots[i].commands[j].command)) {
                if(this.bots[i].commands[j].type === "api") {
                  if (/Youtube Comments/.test(messageContent.message)) {
                    const words = messageContent.message.split(' ');
                    if(words.length < 3) {
                      sendBotMessage(this.bots[i].name, this.bots[i].photo, 'Vous devez indiquer un id de vidéo après la commande "Youtube Comments"');
                    } else {
                      const videoId = words[2];
                      sendBotApi(this.bots[i].name, this.bots[i].photo, this.bots[i].commands[j].command, videoId);
                    }
                    continue;
                  }
  
                  if (/Youtube Vidéo/.test(messageContent.message)) {
                    const words = messageContent.message.split(' ');
                    if(words.length < 3) {
                      sendBotMessage(this.bots[i].name, this.bots[i].photo, 'Vous devez indiquer une recherche de vidéo après la commande "Youtube Vidéo"');
                    } else {
                      sendBotApi(this.bots[i].name, this.bots[i].photo, this.bots[i].commands[j].command, wordsWithoutCommand(words, 2));
                    }
                    
                    continue;
                  }
  
                  if (/Météo/.test(messageContent.message)) {
                    const words = messageContent.message.split(' ');
                    if(words.length < 2) {
                      sendBotMessage(this.bots[i].name, this.bots[i].photo, 'Vous devez indiquer une ville après la commande "Météo"');
                    } else {
                      const ville = words[1];
                      sendBotApi(this.bots[i].name, this.bots[i].photo, this.bots[i].commands[j].command, ville);
                    }
                    continue;
                  }
                  sendBotApi(this.bots[i].name, this.bots[i].photo, this.bots[i].commands[j].command);
                }
  
                if(this.bots[i].commands[j].type === "text") {
                  if(this.bots[i].commands[j].command === "Salut" ||
                  this.bots[i].commands[j].command === "Bonjour" ||
                  this.bots[i].commands[j].command === "Hi" ||
                  this.bots[i].commands[j].command === "Hey") {
                    sendBotMessage(this.bots[i].name, this.bots[i].photo, this.saluer[Math.floor(Math.random() * this.saluer.length)]);
                  } else if (this.bots[i].commands[j].command === "Help") {
                    sendBotMessage(this.bots[i].name, this.bots[i].photo, this.getCommands());
                  } else {
                    sendBotMessage(this.bots[i].name, this.bots[i].photo, this.bots[i].commands[j].reply);
                  }
                }
                
              }
            }
          }
  
        }else{
          e.preventDefault();
        }
      });
  
    }
  
    run() {
      this.getMenu();
      this.getSidebar();
      this.render();
    }
}