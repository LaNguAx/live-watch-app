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
    return {
      roomId: "",
      users: new Map(),
      chat: [],
      status: "",
      video: {
        id: "",
        title: "",
        thumbnail: "",
        author: "",
        publishedAt: "",
        description: "",
        duration: "",
        url: "",
        time: 0,
      },
    };
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
      state.roomId = roomId;
      if (state.users.size === 0) {
        console.log("test");
        state.users.set(socket.id, { name: user.name, isHost: true });
        socket.emit("set-room-host");
      } else state.users.set(socket.id, user);

      rooms.set(roomId, state);
      // join the Socket.IO room (Adapter events handle rooms Map)
      socket.join(roomId);

      // immediately broadcast the full room state
      // const state = rooms.get(roomId) || createRoomState();
      io.in(roomId).emit("update-room", { ...state, users: Object.fromEntries(state.users) });
    });

    socket.on("leave-room", ({ roomId }, ack) => {
      // leave the Socket.IO room (Adapter will fire its leave-room event)
      socket.leave(roomId);

      // broadcast updated state to remaining clients
      const state = rooms.get(roomId);
      if (state) {
        io.in(roomId).emit("update-room", { ...state, users: Object.fromEntries(state.users) });
      }

      if (typeof ack === "function") ack();
    });

    socket.on("send-message", ({ roomId, message }) => {
      const state = rooms.get(roomId);
      if (!state) return;

      function getUserFromSocket(room, socketId) {
        const user = room.users.get(socketId);
        if (!user) return;

        return user.name;
      }

      const returnMessage = {
        user: getUserFromSocket(state, socket.id),
        message,
      };

      state.chat.push(returnMessage);
      io.in(roomId).emit("send-message", { message: returnMessage });
    });

    /** ROOM HANDLERS START */
    socket.on("set-room-video", ({ roomId, video }) => {
      const state = rooms.get(roomId);
      if (!state) return;

      // Reset video state when new video is set
      state.video = { ...video, time: 0 };
      state.status = "waiting"; // Always start in waiting state

      // Broadcast to all clients including sender for consistency
      io.in(roomId).emit("set-room-video", { video: state.video });
      io.in(roomId).emit("update-room", { ...state, users: Object.fromEntries(state.users) });
    });

    socket.on("play-room-video", ({ roomId, playTime }) => {
      const state = rooms.get(roomId);
      if (!state) return;

      // Update server state with current time and playing status
      state.video.time = playTime;
      state.status = "active";

      // Broadcast current server state to ensure everyone is in sync
      const syncData = {
        playTime: state.video.time,
        status: state.status,
        timestamp: Date.now(), // Add timestamp for sync validation
      };

      socket.in(roomId).emit("play-room-video", syncData);
      io.in(roomId).emit("update-room", { ...state, users: Object.fromEntries(state.users) });
    });

    socket.on("pause-room-video", ({ roomId, currentTime }) => {
      const state = rooms.get(roomId);
      if (!state) return;

      // Update server state with pause time and status
      if (currentTime !== undefined) {
        state.video.time = currentTime;
      }
      state.status = "waiting";

      const syncData = {
        pauseTime: state.video.time,
        status: state.status,
        timestamp: Date.now(),
      };

      socket.in(roomId).emit("pause-room-video", syncData);
      io.in(roomId).emit("update-room", { ...state, users: Object.fromEntries(state.users) });
    });

    socket.on("seek-room-video", ({ roomId, time, shouldPlay }) => {
      const state = rooms.get(roomId);
      if (!state) return;

      // Update server state
      state.video.time = time;
      // Preserve playing state unless explicitly changed
      if (shouldPlay !== undefined) {
        state.status = shouldPlay ? "active" : "waiting";
      }

      const syncData = {
        time: state.video.time,
        status: state.status,
        timestamp: Date.now(),
      };

      socket.in(roomId).emit("seek-room-video", syncData);
      io.in(roomId).emit("update-room", { ...state, users: Object.fromEntries(state.users) });
    });

    socket.on("save-watch-time", ({ roomId, time }) => {
      const state = rooms.get(roomId);
      if (!state) return;

      // Only update time if video is playing (to prevent drift during pause)
      if (state.status === "active") {
        state.video.time = time;
      }
    });

    // New handler for requesting current sync state
    socket.on("request-sync", ({ roomId }) => {
      const state = rooms.get(roomId);
      if (!state) return;

      const syncData = {
        video: state.video,
        status: state.status,
        timestamp: Date.now(),
        authoritative: true, // Mark as authoritative server state
      };

      socket.emit("sync-response", syncData);
    });

    /** ROOM HANDLERS END */

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
          io.in(roomId).emit("update-room", { ...state, users: Object.fromEntries(state.users) });
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
    });
  });
}
