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

const rooms = [];

io.on('connection', (socket) => {
  console.log('a user connected');
  let roomNum = 0;
  // io.sockets
  //   .in('room-', roomno)
  //   .emit('connectToRoom', 'you are in room no ' + roomno);
  socket.on('join', function (roomno) {
    const room = {
      id: uuidv4(),
      noOfClients: roomno,
      availableSpace: 0,
    };

    console.log(room);

    if (rooms.length > 0) {
      const roomsLikeUserChoiceOfRoom = rooms.find(
        (r) => r.noOfClients === roomno
      );
      roomsLikeUserChoiceOfRoom.forEach((room) => {
        if (room.availableSpace <= room) {
          socket.join(room.id);
          roomNum = room.noOfClients;
          socket.emit(
            'connectToRoom',
            'you are in room no ' + room.id
          );
          room.availableSpace++;
        }
      });
    }
    socket.join(room.id);
    roomNum = room.noOfClients;
    socket.emit('connectToRoom', 'you are in room no ' + room.id);
  });

  socket.on('message', (message) => {
    console.log(message);
    const text = JSON.parse(message);
    io.to(roomNum).emit('message', `${text.id} said ${text.message}`);
  });
});

http.listen(8080, () =>
  console.log('listening on port http://localhost:8080')
);
