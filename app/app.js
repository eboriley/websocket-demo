// const socket = new WebSocket('ws://localhost:8080');

// socket.onmessage = ({ data }) => {
//   console.log('Message from server', data);
// };

// document.querySelector('button').onclick = () => {
//   socket.send('hello');
// };

const socket = io('ws://localhost:8080');
let id = '';
let guestId = localStorage.getItem('guestId');
function generateID() {
  axios
    .get('http://localhost:8080/get-id')
    .then((response) => {
      id = response.data;
      console.log(id);
      localStorage.setItem('guestId', id);
      guestId = localStorage.getItem('guestId');
      console.log(guestId);
    })
    .catch((error) => console.error(error));
}
if (!guestId) {
  generateID();
} else {
  console.log(guestId);
}

socket.on('message', (text) => {
  const el = document.createElement('li');
  el.innerHTML = text;
  document.querySelector('ul').appendChild(el);
});

document.querySelector('button').onclick = () => {
  const user = {
    id: guestId,
    message: '',
  };
  user.message = document.querySelector('input').value;
  socket.emit('message', JSON.stringify(user));
};
