import http from "http";
import { initApp } from "./app.js";
import { connectToDB } from "./config/db.js";
import { Server } from "socket.io";
import { CLIENT_URL, PORT } from "./config/consts.js";
import setupSocketHandlers from "./sockets/index.js";
import { router as youtubeRouter } from "./routes/youtubeRouter.js";

const startServer = async () => {
  const app = initApp();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  setupSocketHandlers(io);

  // await connectToDB();

  app.use("/api/youtube", youtubeRouter);

  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

  // temp route handler just to see everything's working
  app.get("/health", (req, res) => res.send("Server is working."));
};

startServer();
