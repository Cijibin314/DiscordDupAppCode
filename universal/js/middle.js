//let socket = new WebSocket("ws://localhost:8080");
let socket = new WebSocket("https://discorddupbackend.onrender.com");
socket.onopen = function(e) {
  //alert("[open] Connection established");
  console.log("Connected")
  try{
    startup()
  }catch(e){
  }//should happen. Some pages/apps don't have a startup
};

socket.onmessage = function(event) {
  let JSONInteraction = event.data.toString()
  JSONInteraction = JSON.parse(JSONInteraction)
  handleResponse(socket, JSONInteraction);
};

socket.onclose = function(event) {
  if (event.wasClean) {
    console.log("Connection closed cleanly")
    alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    console.log("connection died")
    alert('[close] Connection died with code: ', event.code);
  }
};

socket.onerror = function(error) {
  console.log("Error, connection has died")
  alert(`[error]`);
};
