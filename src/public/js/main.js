const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-message');
const listUsers = document.getElementById('users');
const roomName = document.getElementById('room-name');

const socket = io();
const { codName, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

socket.emit('joinRoom', { codName, room });

socket.on('message', message => {
  OutputMessage(message);

  chatMessage.scrollTop = chatMessage.scrollHeight;
})

socket.on('roomUsers', ({ room, users }) => {
  OutputUsersNames(users);
  OutputRoomName(room);
})

chatForm.addEventListener('submit', event => {
  event.preventDefault();

  const message = event.target.elements.msg.value;

  socket.emit('chatMessage', message);

  event.target.elements.msg.value = '';
  event.target.elements.msg.focus();
})

function OutputMessage(message) {
  const div = document.createElement('div');

  div.classList.add('message');
  div.innerHTML = `
    <p class = "meta">
     ${message.userName}
     <span> ${message.time} </span>
    </p>

    <p class = "text"> ${message.text} </p>
  `

  chatMessage.appendChild(div);
}

function OutputUsersNames(users) {
  listUsers.innerHTML = `
    ${users.map(user => `<li> ${user.codName} </li>`).join('-')}
  `
}

function OutputRoomName(room) {
  roomName.innerText = room;
}
