import { ApolloServer } from "apollo-server-express";
import { Server } from "socket.io";
import express from "express";
import http from "http";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";

import database from './config/database';

const SECRET = process.env.JWT_SECRET;

const app = express();
const httpServer = http.createServer(app);

// Connect to the database
database();

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Handle Socket.IO connections and events
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Handle joining a room
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  // Handle sending and receiving chat messages
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Define context for Apollo Server
const context = ({ req }: any) => {
  const { authorization } = req.headers;
  if (authorization) {
    const { userId }: any = jwt.verify(authorization, SECRET);
    return { userId };
  }
};

// Create an Apollo Server
const server = new ApolloServer({ typeDefs, resolvers, context });

// Start the server
const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  // Start the HTTP server
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 5000 }, resolve)
  );

  console.log(`Server ready at http://localhost:5000${server.graphqlPath}`);
};

startServer();
