/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
const uuid = require('uuid');
import { ulid } from 'ulid';
import { appConfig } from '@myapp/app-config';

const appConfigValues = appConfig();
const APP_PORT = process.env.APP_PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
io.engine.generateId = (req) => {
  return ulid();
};

const init = async () => {
  app.get('/health', (req, res) => {
    res.send({ message: 'up' });
  });

  io.on('connection', (socket) => {
    console.log(`connection ${socket.id}`);

    socket.on('disconnecting', (reason) => {
      console.log(`disconnecting ${socket.id} ${reason}`);
    });
    socket.on('disconnect', (reason) => {
      console.log(`disconnect ${socket.id} ${reason}`);
    });
  });

  server.listen(APP_PORT, () => {
    console.log(`listening on *:${APP_PORT}`);
  });
};

init();
