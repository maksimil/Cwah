import path from "path";
import express from "express";
import http from "http";
import config from "../config.json";
import socketio from "socket.io";

// create app
const app = express();

// create server
const server = http.createServer(app);

// serve public folder
app.use(express.static(path.join("build")));

// ws
const io = socketio(server);

// listening
const timeout = 1000;
const { port, lanip } = config;
const connect = () => {
  try {
    server.listen(port, lanip, () => {
      console.log(`Listening on ${port} http://${lanip}:${port}`);
    });
  } catch (e) {
    console.error(e);
    console.log(`Reconnectiong after ${timeout}ms`);
    setTimeout(connect, timeout);
  }
};
connect();
