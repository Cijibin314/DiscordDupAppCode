function generateConversationLabel(sender, receiver){
    function findClosestString(strings) {
        // Sort the array using localeCompare for case-insensitive comparison
        const sortedStrings = strings.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
        // Return the first string (closest to the beginning of the alphabet)
        return sortedStrings[0];
    }
    const strings = [sender, receiver]
    
    const closestString = findClosestString(strings);

    if(closestString === sender){
        return `${closestString}-${receiver}`
    }else{
        return `${closestString}-${sender}`
    }
}
async function handleResponse(socket, JSONInteraction){
    const interaction = new Interaction(JSONInteraction)
    let response = false;
    if(interaction.getSucessful()){
        switch(interaction.getPurpose()){
            case "setWebsocketName":
                console.log("Websocket name successfully set to: ", interaction.getUsername())
                break;
            case "userConversations":
                try{
                    const myList = interaction.getConversationTitles()
                    for (convName of myList){
                        if(!globalConvHistories[convName]){
                            globalConvHistories[convName] = []
                        }else{
                        }
                    }
                }catch(e){
                    console.log("Error while getting conversation titles")
                }
                break;
            case "messageRead":
                console.log("Message sucesfully read")
                break;
            case "message":
                try{
                    if(interaction.getAdditionalText() !== "aiResponse"){
                        console.log("Message sucessfully sent")
                    }else{
                        console.log("AI response received")
                        // deletes "Generating"
                        generatingTextBubble.remove()
                        // adds new response
                        const JSONMessage = interaction.getJSONMessage()
                        const message = new Message(JSONMessage)
                        const aiText = new TextBubble(message)
                        aiText.render()
                    }
                }catch(e){
                    console.error("An error ocurred while receiving message: ", e)
                }
                break;
            case "userExists":
                try{
                    const exists = interaction.getAdditionalText()
                    if(exists){
                        console.log("Adding ", interaction.getUsername(), " to the list")
                        globalExistingUsers.push(interaction.getUsername())
                    }else{
                        console.log("User dosen't exist")
                    }
                }catch(e){
                    console.error("An error ocurred while receiving userExists: ", e)
                }
                break;
            case "listOfMessages":
                try{
                    if(interaction.getErrorMessage() === "Conversation dosen't exist"){
                        console.log("Conversation doesn't exist for convName: ", interaction.getConvName())
                    }else{
                        let messages = interaction.getJSONMessages();
                        const oneJSONMessage = messages[0]
                        const oneMessage = new Message(oneJSONMessage)
                        const convLabel = generateConversationLabel(oneMessage.getSender(), oneMessage.getReceiver());
                        console.log(`Setting ${convLabel} to : `, messages)
                        messages = messages.map((JSONMessage_)=>{
                            return new Message(JSONMessage_)
                        })
                        globalConvHistories[convLabel] = messages
                        console.log("Messages sucesfully received")
                    }
                }catch(e){
                    console.log("Error while receiving messages for ", interaction.getConvName())
                }
                break;
            case "validateUser":
                try{
                    const userValidated = interaction.getValidation()
                    if(userValidated){
                        console.log("User sucesfully validated")
                        console.log("Sending: , ", interaction.getUsername())
                        localStorage.setItem("username_", interaction.getUsername())
                        window.location.href = "../../mainPage/html/mainPage.html"
                        //window.electron.send("open-main-page", interaction.getUsername())
                    }else{
                        const additionalText = interaction.getAdditionalText()
                        if(additionalText === "Incorrect Username"){
                            const errorMessage = document.createElement("p")
                            errorMessage.textContent = "Username Doesn't Exist"
                            errorMessage.style.color = "red"
                            const parent = document.getElementById("usernameGroup")
                            parent.appendChild(errorMessage)
                            setTimeout(()=>{
                                errorMessage.remove()
                            }, 2000)
                        }else if(additionalText === "Incorrect Password"){
                            const errorMessage = document.createElement("p")
                            errorMessage.textContent = "Incorrect Password"
                            errorMessage.style.color = "red"
                            const parent = document.getElementById("passwordGroup")
                            parent.appendChild(errorMessage)
                            setTimeout(()=>{
                                errorMessage.remove()
                            }, 2000)
                        }else{
                            alert("Additional text: ", additionalText)
                        }
                        console.log("User was not validated")
                    }
                }catch(e){
                    console.error("An error ocurred while receiving validation: ", e)
                }
                break;
            case "addUser":
                console.log("User sucessfully added")
                break;
            case "deleteUser":
                console.log("User sucessfully deleted")
                break;
            case "deleteMessage":
                console.log("Message sucessfully deleted")
                break;
            case "listOfUnreadMessages":
                try{
                    let unreadMessages = interaction.getJSONMessages()
                    console.log("Unread Messages: ", unreadMessages)
                }catch(e){
                    console.error("An error ocurred while receiving listOfUnreadMessages")
                }
                break;
            case "getEmailAddress":
                try{
                    const email = interaction.getEmail()
                    console.log(email)
                    globalEmailAddress = email
                }catch(e){
                    console.error("An error ocurred while receiving getEmailAddress: ", e)
                }
                break;
            case "sendEmail":
                console.log("Email sucesfully sent")
                break;
            case "newConversationHistory":
                console.log("New conversation sucesfully made")
                break;
            // case "aiCompletion":
            //     try{
            //         if(globalReceiver === "AI"){
            //             const JSONMessage = interaction.getJSONMessage()
            //             const message = new Message(JSONMessage)
            //             const aiText = new TextBubble(message)
            //             aiText.render()
            //         }
            //     }catch(e){
            //         console.error("An error ocurred while receiving aiCompletion: ", e)
            //     }
            //     break;
            case "setMaxLength":
                console.log("Max length sucesfully set")
                break;
            case "S:newMessage":
                try{
                    const JSONMessage = interaction.getJSONMessage()
                    const message = new Message(JSONMessage)
                    const sender = message.getSender()
                    if(globalReceiver === sender){ // if currently in the conversation
                        //renders the text
                        message.read()
                        const text = new TextBubble(message)
                        text.render()

                        //reads the text
                        readMessage(message)
                    }
                    console.log("Received from server new Message:  ", message.getText())
                }catch(e){
                    console.error("An error ocurred while receiving newMessage from server: ", e)
                }
                break;
            case "S:readMessage":
                try{
                    const JSONMessage = interaction.getJSONMessage()
                    const message = new Message(JSONMessage)
                    const receiver = message.getReceiver()
                    console.log("Received a request to read message: ", message.getText())
                    if(globalReceiver === receiver){ // if currently in the conversation
                        //reads the text
                        message.read()
                        console.log("from the received request to receive message, making the message visually read")
                        const id = `${message.getSender()}-->${message.getReceiver()}${message.getCreatedAt()}`
                        console.log("Id of message to visually read: ", id)
                        document.getElementById(id).classList.remove("unreadMessage")
                    }else{
                        console.log("Not cuirrently in conversation, so nothing to update on the conversation")
                        console.log("Values for prev log: ", globalReceiver, sender)
                    }
                }catch(e){
                    console.error("An error occured while receiving S:readMessage: ", e)
                }
                break;
            case "invalidInteraction":
                console.error("Server received an invalid interaction")
                alert("Server received an invalid interaction")
                break;
                default:
                console.log("Interaction: ", JSONInteraction)
                console.error("Error: No functoinality of interaction of server-->client specified  (Most common fix to this error --> forgot to add a break statement in response.js client-side)")
        }
        if(response){
            socket.send(JSON.stringify(response.toJSON()))
        }
        completedRequests.push(interaction.getId())
    }else{
        console.log(`Server failed at: ${interaction.getPurpose()} with an error message of: ${interaction.getErrorMessage()}`)
    }
}