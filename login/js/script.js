let globalEmailAddress = ""
let userValidated

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

document.addEventListener("DOMContentLoaded",()=>{
    document.getElementById("submitButton").addEventListener("click",async ()=>{
        const username = document.getElementById("username").value
        await socket.send(username)
        const password = document.getElementById("password").value
        await serverInteractions.validateUser(username, password)
    })
    // setTimeout(async ()=>{
    //     const username = document.getElementById("username").value
    //     await socket.send(username)
    //     const password = document.getElementById("password").value
    //     await serverInteractions.validateUser(username, password)
    // }, 1000)

    document.getElementById("resetPassword").addEventListener("click",async ()=>{
        let username = document.getElementById("username").value
        if(!username){
            alert("Please enter a username")
            return
        }
        try{
            socket.send(username)
            console.log("Connected with: ", username)
            const emailId = await serverInteractions.getEmailAddress(username)
            await waitUntilResolved(emailId)
            console.log("Email: ", globalEmailAddress)
            const id = await serverInteractions.sendEmail(globalEmailAddress, username)
            await waitUntilResolved(id)
            console.log("Email sent sucesfully: ")
        }catch(e){
            console.log("Not connected yet")
        }
    })
    
})


let completedRequests  = [];