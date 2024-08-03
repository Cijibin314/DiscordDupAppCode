function generateUUID() {
    let d = new Date().getTime(); // Timestamp
    let d2 = (performance && performance.now && (performance.now()*1000)) || 0; // Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16; // Random number between 0 and 16
      if(d > 0){ // Use timestamp until depleted
        r = (d + r)%16 | 0;
        d = Math.floor(d/16);
      } else { // Use microseconds since page-load if supported
        r = (d2 + r)%16 | 0;
        d2 = Math.floor(d2/16);
      }
      return (c==='x' ? r : (r&0x3|0x8)).toString(16);
    });
  }



class TextBubble{
    textBubble;
    message;
    timestamp;
    constructor(message){
        this.message = message
        this.timestamp=message.getCreatedAt()
        this.textBubble = document.createElement('div')
        this.textBubble.textContent = message.getText()
        this.textBubble.id = `${this.message.getSender()}-->${this.message.getReceiver()}${this.timestamp}`
        if(!message.getRead()){
            this.textBubble.classList.add("unreadMessage")
        }
        if(message.getSender() === globalUsername){
            this.textBubble.classList.add("userMessage")
        }else{
            this.textBubble.classList.add("receiverMessage")
        }
    }
    render(){
        const parent = document.getElementById("messages")
        parent.appendChild(this.textBubble)
    }
    getElement(){
        return this.textBubble
    }
    getText(){
        return this.textBubble.textContent
    }
    getTimestamp(){
        return this.timestamp
    }
    getId(){
        return this.textBubble.id
    }
    getMessage(){
        return this.message
    }
    remove(){
        this.textBubble.remove()
    }
}