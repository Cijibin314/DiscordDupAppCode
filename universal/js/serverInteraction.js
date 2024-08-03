class ServerInteractions{
    async changeConnectionUsername(oldUsername, newUsername){
        const interaction = new Interaction({"purpose": "setWebsocketName", "username": oldUsername, "additionalText": newUsername})
        await this.sendInteraction(interaction)
        return await interaction.getId()
    }
    async getUnreadMessages(){
        const interaction = new Interaction({"purpose": "listOfUnreadMessages", "username": globalUsername})
        await this.sendInteraction(interaction)
        return await interaction.getId()
    }

    async setMessageRead(message){
        const interaction = new Interaction({"purpose": "messageRead", "JSONMessage": message.toJSON()})
        await this.sendInteraction(interaction)
        return await interaction.getId()

    }
    async getConvTitles(){
        const interaction = new Interaction({"purpose": "userConversations", "username": globalUsername})
        await this.sendInteraction(interaction)
        return await interaction.getId()
    }
    async sendMessage(message){
        // handles both regular messages and ai messsages
        const interaction = new Interaction({"purpose": "message", "JSONMessage": message.toJSON()})
        await this.sendInteraction(interaction)
        if(message.receiver === "AI"){ // make a generating text bubble in the mean time
            const generatingMessage = new Message(toJSON("Generating...", "AI", globalUsername))
            const generatingText = new TextBubble(generatingMessage)
            generatingText.render()
            generatingTextBubble = generatingText
        }
        return await interaction.getId()
    }

    async getMessages(convName){
        const interaction = new Interaction({"purpose": "listOfMessages", "convName": convName})
        await this.sendInteraction(interaction)
        return await interaction.getId()
    }

    async validateUser(username, password){
        const interaction = new Interaction({"purpose": "validateUser", "username": username, "password":  password})
        await this.sendInteraction(interaction)
        return await interaction.getId()
    }

    async addUser(username, password, email){
        const interaction = new Interaction({"purpose": "addUser", "username": username, "password": password, "email": email})
        await this.sendInteraction(interaction)
        return await interaction.getId()
    }

    async deleteUser(username){
        const interaction = new Interaction({"purpose": "deleteUser", "username":username})
        await this.sendInteraction(interaction)
        return await interaction.getId()
    }

    async deleteMessage(message){
        const interaction = new Interaction({"purpose": "deleteMessage", "JSONMessage": message.toJSON()})
        await this.sendInteraction(interaction)
        return await interaction.getId()
    }
    async getEmailAddress(username){
        const interaction = new Interaction({"purpose": "getEmailAddress", "username": username})
        await this.sendInteraction(interaction)
        return await interaction.getId()
    }
    async sendEmail(email, username){
        const interaction = new Interaction({"purpose": "sendEmail", "email": email, "username": username})
        await this.sendInteraction(interaction)
        return await interaction.getId()
    }
    async userExists(username){
        const interaction = new Interaction({"purpose": "userExists", "username": username})
        await this.sendInteraction(interaction)
        return await interaction.getId()
    }
    async newConversationHistory(username1, username2){
        const interaction = new Interaction({"purpose": "newConversationHistory", "username": username1, "additionalText": username2})
        await this.sendInteraction(interaction)
        return await interaction.getId()
    }
    // async generateResponse(prompt){
    //     console.log("Gneerating completion to: ", prompt)
    //     const interaction = new Interaction({"purpose": "aiCompletion", "additionalText": prompt, "username": globalUsername})
    //     await this.sendInteraction(interaction)
    //     return await interaction.getId()
    // }
    async setMaxLength(maxLength){
        const interaction = new Interaction({"purpose": "setMaxLength", "additionalText": maxLength})
        await this.sendInteraction(interaction)
        return await interaction.getId()
    }
    async sendInteraction(myInteraction){
        console.log("Sending interaction to server: ", myInteraction)
        const JSONInteraction = myInteraction.toJSON()
        socket.send(JSON.stringify(JSONInteraction))
    }
}
const serverInteractions = new ServerInteractions()