const socket = io('http://localhost:8000',
    {
        transports: ['websocket', 'polling', 'flashsocket']
    });
//grtting dom with veriables 
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")

// audio will play on receiving messages 
var audio = new Audio('ting.mp3');

// function will append element to container 
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}
//giveing promt to ask user name  and let the server know about event 
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);
//if new user join receive event from server  
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right')
})

//if server send the message receive it 
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left')
})
//if user leaves the chat , append the info to the container 
socket.on('left', name => {
    append(`${name} left the chat`, 'right')
})
//if form gets submitted send server the message 
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''
})

