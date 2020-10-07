"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
const StateHandler_1 = require("./StateHandler");
const PlayerState_1 = require("./state/PlayerState");
const World_1 = require("../game/World");
const constants_1 = require("../constants");
class GameRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 4;
    }
    // When room is initialized
    onCreate(options) {
        this.world = new World_1.World();
        this.world.init();
        console.log('World is initialized');
        this.setSimulationInterval(() => this.onUpdate());
        this.setState(new StateHandler_1.StateHandler());
        // When a client sends a message
        this.onMessage(constants_1.MessageType.PLAYER_MOVEMENT, (client, message) => {
            //console.log(message)
            const data = message;
            const player = this.state.getPlayer(client.sessionId);
            this.world.players[client.sessionId].applyMovement(data);
        });
    }
    // Checks if a new client is allowed to join.
    // requestJoin(options: any, isNew: boolean) {
    //   console.log("requestJoin", options, isNew)
    //   return options.create ? options.create && isNew : this.clients.length > 0;
    // }
    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    // When client successfully join the room
    onJoin(client, options) {
        this.world.createPlayer(client.sessionId);
        const player = new PlayerState_1.PlayerState(client.sessionId, this.world.players[client.sessionId].playerMesh.position.x, this.world.players[client.sessionId].playerMesh.position.z);
        this.state.addPlayer(client.sessionId, player);
        //console.log(`player ${client.sessionId} joined room ${this.roomId}.`);
    }
    onUpdate() {
        Object.keys(this.world.players).forEach(key => {
            const pos = this.world.players[key].playerMesh.position;
            this.state.players[key].updatePosition(pos);
        });
    }
    // When a client leaves the room
    onLeave(client) {
        this.world.removePlayer(client.sessionId);
        this.state.removePlayer(client.sessionId);
    }
    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose() {
        this.world.dispose();
    }
}
exports.GameRoom = GameRoom;
//# sourceMappingURL=GameRoom.js.map