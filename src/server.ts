// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import { Server } from 'colyseus';
import { createServer } from 'http';
import { monitor } from '@colyseus/monitor';

import app from './app';
import { GameRoom } from './rooms/GameRoom';

/**
 * Start Express server.
 */

const gameServer = new Server({
  server: createServer(app),
});

gameServer.define('game', GameRoom)
          .on("create", (room) => console.log("room created:", room.roomId))
          .on("dispose", (room) => console.log("room disposed:", room.roomId))
          .on("join", (room, client) => console.log(client.id, "joined", room.roomId))
          .on("leave", (room, client) => console.log(client.id, "left", room.roomId));
// Register colyseus monitor AFTER registering your room handlers
app.use('/colyseus', monitor());

const server = gameServer.listen(app.get('port'), undefined, undefined, () => {
  console.log('App is running in %s mode', app.get('port'), app.get('env'));
  console.log('Press CTRL-C to stop\n');
});

export default server;

// colyseus 0.10.7