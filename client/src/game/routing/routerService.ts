import * as Colyseus from 'colyseus.js';
import * as BABYLON from 'babylonjs';

import { World } from '../World';

import { MessageType } from '../../constants';

export class RouterService {
  client: Colyseus.Client;
  roomId: string;
  world: World;
  room!: Colyseus.Room;

  constructor(client: Colyseus.Client, world: World, roomId: string) {
    this.client = client;
    this.roomId = roomId === 'new' ? 'game' : roomId;
    this.world = world;
  }

  connect() {
    //console.log('ROUTER', this.roomId)
    this.client.joinOrCreate("game").then(room => {
      this.room = room
      console.log('client joined successfully');
      this.setupMessageListeners();
    }).catch(e => {
      console.error("join error", e);
    });
    // this.room.onJoin.add(() => {
    //   console.log('client joined successfully');
    //   this.setupMessageListeners();
    // });
  }

  private setupMessageListeners() {
    this.room.state.players.onAdd = (player: any, key: string) => {
      //console.log(player, 'player was added');
      if (key !== this.room.sessionId) {
        this.world.addRival(key, new BABYLON.Vector3(player.x, 1, player.y));
      }
    };

    this.room.state.players.onChange = (player: any, key: string) => {
      if(key === this.room.sessionId) {
        this.world.updatePlayer(key, new BABYLON.Vector3(player.x, 1, player.y));
      } else {
        this.world.updateRival(key, new BABYLON.Vector3(player.x, 1, player.y));
      }
    };

    this.room.state.players.onRemove = (player: any, key: string) => {
      this.world.removeRival(key);
    };
  }

  sendMovement(
    direction: BABYLON.Vector2,
    keyUp: boolean,
    keyDown: boolean,
    keyLeft: boolean,
    keyRight: boolean
  ) {
    // const keyUp1 = keyUp ? 1 : 0
    // const keyDown1 = keyDown ? 1 : 0
    // const keyLeft1 = keyLeft ? 1 : 0
    // const keyRight1 = keyRight ? 1 : 0
    // const dir = { x: direction.x, y: direction.y }
    // console.log({ dir, keyUp1, keyDown1, keyLeft1, keyRight1 })
    this.room.send(
      MessageType.PLAYER_MOVEMENT,
      { direction, keyUp, keyDown, keyLeft, keyRight },
    );
  }
}
