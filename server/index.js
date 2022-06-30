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

  socket.on('join', function (roomno) {
    if (rooms.length >= 1) {
      const roomsLikeUserChoiceOfRoom = searchRooms(
        roomno,
        socket,
        io
      );
      if (!roomsLikeUserChoiceOfRoom) {
        createRoom(roomno, socket, io);
      } else
        addClientToChoiceOfRoom(
          roomsLikeUserChoiceOfRoom,
          socket,
          io
        );
    }
    if (rooms.length === 0) {
      createRoom(roomno, socket, io);
    }
  });

  socket.on('message', (message) => {
    console.log(message);
    const text = JSON.parse(message);
    io.to(text.roomId).emit(
      'message',
      `${text.id} said ${text.message}`
    );
  });
});

http.listen(8080, () =>
  console.log('listening on port http://localhost:8080')
);

function createRoom(roomno, socket, io) {
  let roomOpt = JSON.parse(roomno);
  const room = {
    id: uuidv4(),
    clientOpt: parseInt(roomOpt),
    availableSpace: parseInt(roomOpt) - 1,
  };
  console.log(room);
  socket.join(room.id);

  io.to(room.id).emit(
    'connectToRoom',
    'you are in room no ' + room.id
  );

  io.to(room.id).emit('roomID', room.id);

  rooms.push(room);
  console.log(rooms);
}

function searchRooms(roomno) {
  let roomOpt = JSON.parse(roomno);
  for (let room of rooms) {
    if (room.clientOpt === parseInt(roomOpt)) {
      if (room.availableSpace > 0) {
        return room;
      }
    }
  }
  return false;
}

function addClientToChoiceOfRoom(
  roomsLikeUserChoiceOfRoom,
  socket,
  io
) {
  if (roomsLikeUserChoiceOfRoom) {
    for (let room of rooms) {
      if (room.id === roomsLikeUserChoiceOfRoom.id) {
        socket.join(room.id);

        io.to(room.id).emit(
          'connectToRoom',
          'you are in room no ' + room.id
        );

        io.to(room.id).emit('roomID', room.id);
        room.availableSpace -= 1;
        console.table(rooms);
      }
    }
  }
}

// const arr = [
//   { id: 1, name: 'roku' },
//   { id: 2, name: 'ben' },
//   { id: 3, name: 'matt' },
// ];
// console.table(arr);
// const twoIndex = arr.findIndex((item) => item.id === 2);
// arr.splice(twoIndex, 1);
// console.table(arr);
