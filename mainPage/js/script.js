function parseConversationTitleToReceiver(conversationTitle){
    const regex = new RegExp(`(?:${globalUsername}-|-${globalUsername})`);
    return conversationTitle.replace(regex, '');
}
function removeFirstOccurrence(inputString, substringToRemove) {
    // Escape special characters in substringToRemove
    const escapedSubstring = substringToRemove.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Create a regular expression that matches the escaped substring only once
    const regex = new RegExp(escapedSubstring);
    
    // Replace the first occurrence with an empty string
    return inputString.replace(regex, '');
}

function waitUntilResolved(id){
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (completedRequests.includes(id)) {
                clearInterval(interval);
                resolve(true);
                completedRequests.splice(completedRequests.indexOf(id), 1)
            } else {
                console.log("Waiting for id: ", id)
            }
        }, 1);
    });
}

async function selectConversation(convTitle){
    globalReceiver = parseConversationTitleToReceiver(convTitle);
    const parent = document.getElementById("contactList")
    const children = parent.children
    for (let i = 0; i < children.length; i++) {
        children[i].style.backgroundColor = '#4a4c52';
    }
    const title = document.getElementById(`conversationTitle${globalReceiver}`);
    title.style.backgroundColor = "blue"
}
async function readMessage(message){
    console.log("Reading message from script.js: ", message.getText())
    const id = `${message.getSender()}-->${message.getReceiver()}${message.getCreatedAt()}`
    document.getElementById(id).classList.remove("unreadMessage")
    serverInteractions.setMessageRead(message)
}
async function readConversation(convName){
    let messages = globalConvHistories[convName]
    for (let message of messages){
        if(!message.getRead() && message.getSender() !== globalUsername){
            message.setUnread()
            readMessage(message).then(()=>{message.read()})
        }
    }
}

async function getUnreadMessages(convName){
    //updates all the messages in globalConvHistories
    const id = await serverInteractions.getMessages(convName)
    await waitUntilResolved(id)
    let unreadCount = 0
    for (const message of globalConvHistories[convName]) {
        if (!message.getRead() && message.getSender() !== globalUsername) {
            unreadCount++
        }
    }
    return unreadCount
}
async function renderConversation(convName, newConv){
    if(convName === generateConversationLabel(globalUsername, "addConversation")){
        return;
    }
    const oldConvHistory = globalConvHistories[convName]
    const id = await serverInteractions.getMessages(convName)
    await waitUntilResolved(id)
    //deletes the old conversation
    if(newConv){
        const parent = document.getElementById("messages")
        parent.innerHTML = ""
    }

    if(!oldConvHistory || newConv) { // if we need to render the whole conversation
        for (const message of globalConvHistories[convName]) {
            const textBubble = new TextBubble(message)
            textBubble.render()
        }
    }else{ // if we just need to render new messages
        if(oldConvHistory !== globalConvHistories[convName]) {
            for(let i = 0; i < globalConvHistories[convName].length; i++) {
                if(!oldConvHistory[i]){
                    const message = globalConvHistories[convName][i]
                    const textBubble = new TextBubble(message)
                    textBubble.render()
                }
            }
        }
    }
    //mklaes the current convName blue and sets globalReceiver
    selectConversation(convName)
    // updates the number of unread messages and the locations in the conversations
    readConversation(convName)
    const ele = document.getElementById(`${convName}unreadMessages`)
    if(ele){
        document.getElementById(`${convName}unreadMessages`).remove()
    }

}
async function renderConversationList(){
    const id = await serverInteractions.getConvTitles()
    await waitUntilResolved(id)
    const conversationList = Object.keys(globalConvHistories)
    for(const conversationTitle of conversationList){

        const nameOfReceiver = parseConversationTitleToReceiver(conversationTitle)
        const title = new ConvTitle(nameOfReceiver)
        const id = `${conversationTitle}unreadMessages`
        //makes sure that tiels containing unread messages are at the top

        if(document.getElementById(id)){ /// if there are unreadMessages
            //put it at the top of the list
            title.render("top")
        }else{
            //add it to the bottom of the list
            title.render("bottom")
        }
    }
}
async function startup(){
    console.log("First block of startup")
    const username = localStorage.getItem("username_")
    console.log("Received username: ", username)
    globalUsername = username
    console.log("Logged in as: ", globalUsername)
    await socket.send(globalUsername)
    console.log("Sent request")
    //loads the page
    await renderConversationList()
    // select the first conversation when the page loads
    const id = document.getElementById("contactList").firstElementChild.id;
    const receiverName = removeFirstOccurrence(id, "conversationTitle");
    const convTitle = generateConversationLabel(globalUsername, receiverName)// the order dosen't matter
    await renderConversation(convTitle, true)

    //add button event listeners
    //adds sending button listener
    document.getElementById("sendButton").addEventListener("click", async ()=>{
        const inputArea = document.getElementById("inputArea")
        const text = inputArea.value
        const sender = globalUsername
        const message = new Message(toJSON(text, sender, globalReceiver))
        const textBubble = new TextBubble(message)
        textBubble.render()
        const id = await serverInteractions.sendMessage(message)
        await waitUntilResolved(id)
        inputArea.value = ""
    })
    //adds the new conv button listener
    document.getElementById("addConversation").addEventListener("click", newConvTitle)
}
try{
    module.exports = {
        startup
    }
}catch{}
