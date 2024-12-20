import { createServer } from "http";
import { Server } from "socket.io";
import 'dotenv/config';

const PORT = process.env.PORT || 3001; // Use the $PORT variable or default to 3001 locally

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

let waitingRoom = [];  // Users waiting to be matched

io.on("connection", (socket) => {

  // Add user to the "waiting room" list with their socket ID
  waitingRoom.push(socket.id);
  console.log(`User ${socket.id} added to the waiting room`);

  // // Emit the updated list of online users to everyone
  // io.emit('waiting-room', waitingRoom);

  // Check if we can match users
  if (waitingRoom.length >= 2) {
    // Get two users to match
    const user1 = waitingRoom.shift(); // First user in the waiting room
    const user2 = waitingRoom.shift(); // Second user in the waiting room

    // Create a unique chat room
    const chatRoom = `${user1}-${user2}`;

    // Assign users to the private chat room
    io.to(user1).emit('matched', { userId: user2, chatRoom });
    io.to(user2).emit('matched', { userId: user1, chatRoom });

    // Join both users to the chat room
    io.sockets.sockets.get(user1).join(chatRoom);
    io.sockets.sockets.get(user2).join(chatRoom);

    console.log(`Matched users ${user1} and ${user2} in room ${chatRoom}`);
  }

  socket.on('new-message', (data) => {
    const { chatRoom, message } = data;

    // Emit the message to the other user in the chat room
    socket.to(chatRoom).emit('new-message', message);

    console.log(`New message in room ${chatRoom}: ${message.content}`);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Remove the user from the online users list
    waitingRoom = waitingRoom.filter((user) => user !== socket.id);

    // Emit the updated list of online users to everyone
    io.emit('online-users', waitingRoom.length);
  });
});

httpServer.listen(PORT, () => {
  console.log("Websocket server listening on 3001");
});