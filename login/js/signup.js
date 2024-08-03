document.addEventListener("DOMContentLoaded", ()=>{
    document.getElementById("submitButton").addEventListener("click", async ()=>{
        const passwordEle = document.getElementById("password")
        const confirmPasswordEle = document.getElementById("confirmPassword")
        const password = passwordEle.value
        const confirmPassword = confirmPasswordEle.value
        if(password !== confirmPassword){
            console.log("Adding error messsage of passwords not matching")
            const errorEle = document.createElement("div")
            errorEle.style.color = "red"
            errorEle.textContent = "Passwords do not match"
            const parent = document.getElementById("confirmPasswordContainer")
            parent.appendChild(errorEle)
            function passwordListener(){
                errorEle.remove()
                console.log("hi4")
                removeEventListener("change", passwordListener)
            }
            passwordEle.addEventListener("change", passwordListener)
            confirmPasswordEle.addEventListener("change", passwordListener)
        }else{
            const username = document.getElementById("username").value
            const email = document.getElementById("email").value
            socket.send(username)
            await serverInteractions.addUser(username, password, email)
            localStorage.setItem("username_", username)
            window.location.href = "../../mainPage/html/mainPage.html"
            //window.electron.send("open-main-page", username)
        }
    })
    //currently working on this
})

let completedRequests  = [];
