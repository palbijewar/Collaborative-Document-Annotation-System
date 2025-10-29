import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";

export function attachSockets(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("🟢 New socket connected:", socket.id);

    socket.on("room:join", (documentId: string) => {
      socket.join(documentId);
      socket.emit("room:joined", documentId);
      console.log(`👥 User joined document room: ${documentId}`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });

  return io;
}
