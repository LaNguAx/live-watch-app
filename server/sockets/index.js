export default function setupSocketHandlers(io) {
  const rooms = new Map();

  io.on("connection", (socket) => {
    console.log("🔗 Connected:", socket.id);

    socket.on("join-room", ({ roomId }) => {
      socket.join(roomId);

      let room = rooms.get(roomId);
      if (!room) {
        room = new Set();
        rooms.set(roomId, room);
      }
      room.add(socket.id);

      io.in(roomId).emit("get-users-in-room", { roomId, users: Array.from(room) });
      console.log(
        "1️⃣ Rooms After Connect :",
        Array.from(rooms.entries()).map(([roomId, socketSet]) => ({
          roomId,
          users: Array.from(socketSet),
        }))
      );
    });

    socket.on("leave-room", ({ roomId }, ack) => {
      console.log("leaving");
      ack && ack();
    });

    socket.on("disconnecting", () => {
      // the socket automatically is extracted from the inner socket.io rooms map, i need to take it out of my map.
      console.log("⚠️  Disconnecting", socket.id);
      for (const roomId of socket.rooms) {
        if (roomId === socket.id) continue;

        socket.leave(roomId);

        const room = rooms.get(roomId);
        if (room) room.delete(socket.id);

        socket.in(roomId).emit("get-users-in-room", { roomId, users: Array.from(room) });
      }
      console.log(
        "2️⃣ Rooms After Disconnect :",
        Array.from(rooms.entries()).map(([roomId, socketSet]) => ({
          roomId,
          users: Array.from(socketSet),
        }))
      );
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
    });
  });
}
