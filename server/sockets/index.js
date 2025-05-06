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
    return { users: new Map(), chat: [], status: "waiting" };
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

    // I need to add it in join-room event then socket.join(id);
    // const state = rooms.get(room) || createRoomState();
    // state.users.add(id);
    // rooms.set(room, state);
    const state = rooms.get(room);
    console.log(`✔️  Socket ${id} joined ${room} --> `, state);
  });

  adapter.on("leave-room", (room, id) => {
    if (!isAppRoom(room)) return;
    const state = rooms.get(room);
    if (!state) return;

    // I need to first leave the user using leave-room event then socket.leave(id);
    // state.users.delete(id);
    state.users.delete(id);

    if (state.users.size === 0) {
      rooms.delete(room);
      console.log("🗑️ App room deleted (empty):", room);
      console.error(rooms);
    } else {
      console.log(`❌  Socket ${id} left ${room}`, state.users);
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
      // const { name } = user;
      // Add user to rooms cache
      const state = rooms.get(roomId) || createRoomState();
      state.users.set(socket.id, user);
      rooms.set(roomId, state);

      // join the Socket.IO room (Adapter events handle rooms Map)
      socket.join(roomId);

      // immediately broadcast the full room state
      // const state = rooms.get(roomId) || createRoomState();
      io.in(roomId).emit("update-room", {
        roomId,
        users: Object.fromEntries(state.users),
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
          users: Object.fromEntries(state.users),
          chat: state.chat,
          status: state.status,
        });
      }

      if (typeof ack === "function") ack();
    });

    socket.on("disconnecting", () => {
      console.log("⚠️  Disconnecting:", socket.id);
      // Adapter will handle the leave-room/delete-room events automatically

      // If user exits the browser tab then leave-room would not be fired, so the same code to emit to everyone in the room that users changed should be here aswell.

      for (const roomId of socket.rooms) {
        // if the room is user's socket
        if (roomId === socket.id) continue;

        // this'll update the rooms state in cache
        socket.leave(roomId);

        // broadcast updated state to remaining clients
        const state = rooms.get(roomId);
        if (state) {
          io.in(roomId).emit("update-room", {
            roomId,
            users: Object.fromEntries(state.users),
            chat: state.chat,
            status: state.status,
          });
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
    });
  });
}
