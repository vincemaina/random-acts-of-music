import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  // Add user to the "online" list with their socket ID
  onlineUsers.push(socket.id);

  // Emit the updated list of online users to everyone
  io.emit('online-users', onlineUsers);

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Remove the user from the online users list
    onlineUsers = onlineUsers.filter((user) => user !== socket.id);

    // Emit the updated list of online users to everyone
    io.emit('online-users', onlineUsers);
  });
});

httpServer.listen(3001, () => {
  console.log("Websocket server listening on 3001");
});