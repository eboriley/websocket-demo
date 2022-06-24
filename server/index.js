// const Websockets = require('ws');
// const server = new Websockets.server({ port: '8080' });
// server.on('connection', (socket) => {
//   socket.on('message', (message) => {
//     socket.send(`Roger that! ${message}`);
//   });
// });

const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: { origin: '*' },
});

const corsOption = {
  origin: ['*'],
};
app.use(cors(corsOption));
app.use(cors());

app.get('/get-id', (req, res) => {
  res.json(uuidv4());
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (message) => {
    console.log(message);
    const text = JSON.parse(message);
    socket.broadcast.emit(
      'message',
      `${text.id} said ${text.message}`
    );
  });
});

http.listen(8080, () =>
  console.log('listening on port http://localhost:8080')
);
