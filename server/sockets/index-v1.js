export default function setupSocketHandlers(io) {
  const rooms = new Map();
  const initialRoomState = {
    users: new Set(),
    chat: [],
    status: "waiting",
  };

  io.on("connection", (socket) => {
    console.log("🔗 Connected:", socket.id);

    socket.on("join-room", ({ roomId }) => {
      socket.join(roomId);

      let room = rooms.get(roomId);
      if (!room) {
        room = {
          users: new Set(),
          chat: [],
          status: "waiting",
        };
        rooms.set(roomId, room);
      }
      room.users.add(socket.id);

      io.in(roomId).emit("update-room", {
        roomId,
        users: Array.from(room.users),
        chat: room.chat,
        status: room.status,
      });
      console.log(rooms);
    });

    socket.on("send-message", ({ roomId, message }) => {
      // update message in chat of room
      const room = rooms.get(roomId);
      room.chat.push(message);
      console.log(room);
      io.in(roomId).emit("send-message", { message });
    });

    socket.on("leave-room", ({ roomId }, ack) => {
      console.log("Leave room handler..");
      for (const roomId of socket.rooms) {
        if (roomId === socket.id) continue;

        const room = rooms.get(roomId);
        if (room.users) room.users.delete(socket.id);
        if (room.users.size === 0) rooms.delete(roomId);

        io.in(roomId).emit("update-room", {
          roomId,
          users: Array.from(room.users),
          chat: room.chat,
          status: room.status,
        });
        socket.leave(roomId);
      }
      console.log(rooms);

      ack && ack();
    });

    socket.on("disconnecting", () => {
      // the socket automatically is extracted from the inner socket.io rooms map, i need to take it out of my map.
      console.log("⚠️  Disconnecting", socket.id);
      for (const roomId of socket.rooms) {
        if (roomId === socket.id) continue;

        const room = rooms.get(roomId);
        if (room.users) room.users.delete(socket.id);
        if (room.users.size === 0) rooms.delete(roomId);

        socket.in(roomId).emit("update-room", { roomId, users: Array.from(room.users) });
        socket.leave(roomId);
      }
      console.log(rooms);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
    });
  });
}
