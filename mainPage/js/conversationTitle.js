
class ConvTitle{
    constructor(nameOfReceiver){
        this.nameOfReceiver = nameOfReceiver
    }
    async configureTitle(){
        this.title = document.createElement("div")
        this.title.classList.add("conversationTitle")
        this.title.textContent = this.nameOfReceiver
        this.title.id = "conversationTitle" + this.nameOfReceiver
        this.convLabel = generateConversationLabel(globalUsername, this.nameOfReceiver)
        this.title.addEventListener("click", ()=>{
            renderConversation(this.convLabel, true)
        })
        this.unreadMessages = document.createElement("p")
        this.unreadMessages.classList.add("unreadMessages")
        this.unreadMessages.id = `${this.convLabel}unreadMessages`
        this.numUnreadMessages = await getUnreadMessages(this.convLabel)
        if(this.numUnreadMessages > 0){
            this.unreadMessages.textContent = `${this.numUnreadMessages}U`
            this.title.appendChild(this.unreadMessages)
        }
    }
    async render(topOrBottom){
        this.configureTitle()        
        //renders the title
        const parent = document.getElementById("contactList")
        let before;
        if(topOrBottom === "bottom"){
            before = document.getElementById("addConversation")
        }else if(topOrBottom === "top"){
            before = parent.firstChild
        }else{
            console.error("Invalid position of top or bottom")
            return
        }
        parent.insertBefore(this.title, before)

    }
    setUnreadMessages(num){
        this.title.unreadMessages.textContent = `${num}U`
        this.numUnreadMessages = num
    }
    resetUnreadMessages(){
        this.title.unreadMessages.remove()
    }
    getNameOfReceiver(){
        return this.nameOfReceiver
    }
    getTitleEle(){
        return this.title
    }
    getId(){
        return "conversationTitle" + this.nameOfReceiver
    }
}
async function newConvTitle(){
    let title = document.createElement("input")
    title.type="text"
    title.classList.add("conversationTitle")
    const parent = document.getElementById("contactList")
    const newConvBtn = document.getElementById("addConversation")
    parent.insertBefore(title, newConvBtn)
    title.focus()
    title.addEventListener("keydown", async (event)=>{
        if(event.key === "Enter"){
            const nameOfReceiver = title.value
            const existsId = await serverInteractions.userExists(nameOfReceiver)
            await waitUntilResolved(existsId)
            if(globalExistingUsers.includes(nameOfReceiver) && !document.getElementById(`conversationTitle${nameOfReceiver}`)){
                const convName = generateConversationLabel(globalUsername, nameOfReceiver)
                globalConvHistories[convName] = []
                title.remove()
                const permTitle = new ConvTitle(nameOfReceiver)
                // adding the new conversation to history
                const addToHistoryId = await serverInteractions.newConversationHistory(nameOfReceiver, globalUsername)
                await waitUntilResolved(addToHistoryId)
                permTitle.render()
                renderConversation(convName, true)
                
            }else{
                console.log("Doesn't exist       |or|          already is a conv title")
                title.remove()
            }
        }
    })
}