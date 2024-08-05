let globalEmailAddress = ""
let userValidated
let connected = false
function waitUntilResolved(id){
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (completedRequests.includes(id)) {
                clearInterval(interval);
                resolve(true);
            } else {
                //console.log("Current completions: ", completedRequests, " Id that we are looking for: ", id);
                console.log("Waiting for id: ", id)
            }
        }, 10);
    });
}
async function waitUntilConnected(){
    const interval = setInterval(()=>{
        if(connected){
            console.log("Connected2")
            clearInterval(interval)
            return true
        }else{
            console.log("Waiting for connection...")
        }
    })
}
document.addEventListener("DOMContentLoaded",async ()=>{
    await waitUntilConnected()
    console.log("Connected")
    initial = true
    document.getElementById("submitButton").addEventListener("click",async ()=>{
        const username = document.getElementById("username").value
        if(initial){
            initial = false
            await socket.send(username)
            console.log("Send initial username: ", username)
        }
        const password = document.getElementById("password").value
        await serverInteractions.validateUser(username, password)
    })

    document.getElementById("resetPassword").addEventListener("click",async ()=>{
        let username = document.getElementById("username").value
        // if(!username){
        //     alert("Please enter a username")
        //     return
        // }
        if(initial){
            initial = false
            socket.send(username)
            console.log("Connected with: ", username)
        }
        const emailId = await serverInteractions.getEmailAddress(username)
        await waitUntilResolved(emailId)
        console.log("Email: ", globalEmailAddress)
        const id = await serverInteractions.sendEmail(globalEmailAddress, username)
        await waitUntilResolved(id)
        const explain = document.getElementById("resetPasswordLog")
        const beforeVal = explain.textContent
        explain.textContent = "Email sent"
        console.log("Email sent sucesfully: ")
        setTimeout(()=>{explain.textContent = beforeVal}, 5000)
        console.log("Eoor trying to reset password: ", e)
    })
    
})


let completedRequests  = [];