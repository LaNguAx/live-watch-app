export default function setupSocketHandlers(io) {
  // Map<roomId, { users: Set<socketId>, chat: string[], status: string }>
  const rooms = new Map();
  const adapter = io.of("/").adapter;

  // Helper to ignore the “private” rooms named after each socket.id
  function isAppRoom(room) {
    return !io.sockets.sockets.has(room);
  }

  // Create a fresh room state
  function createRoomState() {
    return { users: new Set(), chat: [], status: "waiting" };
  }

  // ── Adapter events keep rooms Map in sync ─────────────────────
  adapter.on("create-room", (room) => {
    if (!isAppRoom(room)) return;
    if (!rooms.has(room)) {
      rooms.set(room, createRoomState());
      console.log("🆕 App room created:", room);
    }
  });

  adapter.on("join-room", (room, id) => {
    if (!isAppRoom(room)) return;
    const state = rooms.get(room) || createRoomState();
    state.users.add(id);
    rooms.set(room, state);
    console.log(`✔️  Socket ${id} joined ${room}`, Array.from(state.users));
  });

  adapter.on("leave-room", (room, id) => {
    if (!isAppRoom(room)) return;
    const state = rooms.get(room);
    if (!state) return;
    state.users.delete(id);

    if (state.users.size === 0) {
      rooms.delete(room);
      console.log("🗑️ App room deleted (empty):", room);
    } else {
      console.log(`❌  Socket ${id} left ${room}`, Array.from(state.users));
    }
  });

  adapter.on("delete-room", (room) => {
    if (!isAppRoom(room) || !rooms.get(room)) return;
    rooms.delete(room);
    console.log("🗑️ App room deleted:", room);
  });

  // ── Per-socket handlers ───────────────────────────────────────
  io.on("connection", (socket) => {
    console.log("🔗 Connected:", socket.id);

    socket.on("join-room", ({ roomId, user }) => {
      // join the Socket.IO room (Adapter events handle rooms Map)
      socket.join(roomId);

      // immediately broadcast the full room state
      const state = rooms.get(roomId) || createRoomState();
      io.in(roomId).emit("update-room", {
        roomId,
        users: Array.from(state.users),
        chat: state.chat,
        status: state.status,
      });
    });

    socket.on("send-message", ({ roomId, message }) => {
      const state = rooms.get(roomId);
      if (!state) return;
      state.chat.push(message);
      io.in(roomId).emit("send-message", { message });
    });

    // socket.on("get-users-in-room", ({ roomId }) => {
    //   const state = rooms.get(roomId);
    //   socket.emit("get-users-in-room", {
    //     roomId,
    //     users: state ? Array.from(state.users) : [],
    //   });
    // });

    socket.on("leave-room", ({ roomId }, ack) => {
      // leave the Socket.IO room (Adapter will fire its leave-room event)
      socket.leave(roomId);

      // broadcast updated state to remaining clients
      const state = rooms.get(roomId);
      if (state) {
        io.in(roomId).emit("update-room", {
          roomId,
          users: Array.from(state.users),
          chat: state.chat,
          status: state.status,
        });
      }

      if (typeof ack === "function") ack();
    });

    socket.on("disconnecting", () => {
      console.log("⚠️  Disconnecting:", socket.id);
      // Adapter will handle the leave-room/delete-room events automatically
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
    });
  });
}
