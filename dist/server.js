"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Load environment variables from .env file
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const colyseus_1 = require("colyseus");
const http_1 = require("http");
const monitor_1 = require("@colyseus/monitor");
const app_1 = __importDefault(require("./app"));
const GameRoom_1 = require("./rooms/GameRoom");
/**
 * Start Express server.
 */
const gameServer = new colyseus_1.Server({
    server: http_1.createServer(app_1.default),
});
gameServer.define('game', GameRoom_1.GameRoom)
    .on("create", (room) => console.log("room created:", room.roomId))
    .on("dispose", (room) => console.log("room disposed:", room.roomId))
    .on("join", (room, client) => console.log(client.id, "joined", room.roomId))
    .on("leave", (room, client) => console.log(client.id, "left", room.roomId));
// Register colyseus monitor AFTER registering your room handlers
app_1.default.use('/colyseus', monitor_1.monitor());
const server = gameServer.listen(app_1.default.get('port'), undefined, undefined, () => {
    console.log('App is running in %s mode', app_1.default.get('port'), app_1.default.get('env'));
    console.log('Press CTRL-C to stop\n');
});
exports.default = server;
// colyseus 0.10.7
//# sourceMappingURL=server.js.map