class Bot {
    constructor(name, intro, photo, commands) {
        this.name = name;
        this.intro = intro;
        this.photo = photo;
        this.commands = commands;
    }
  
    getBot() {
        return {
            name: this.name,
            intro: this.intro,
            photo: this.photo,
            commands: this.commands
        }
    }
}