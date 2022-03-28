class Command {
    constructor(command, description, type, reply) {
        this.command = command;
        this.description = description;
        this.type = type;
        this.reply = reply
    }
  
    getCommand() {
        return {
            command: this.command,
            description: this.description,
            type: this.type,
            reply: this.reply
        }
    }
}