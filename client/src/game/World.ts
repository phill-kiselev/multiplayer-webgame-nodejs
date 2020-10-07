import * as BABYLON from 'babylonjs';

import { Player } from './Player';
import { Rival } from './Rival';

import { ISceneEventArgs } from '../components/Scene';
import { RouterService } from './routing/routerService';

export class World {
  private canvas: HTMLCanvasElement;
  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;

  player!: Player;
  private rivals: { [id: string]: Rival } = {};
  private routerService!: RouterService

  constructor(args: ISceneEventArgs) {
    this.canvas = args.canvas as HTMLCanvasElement
    this.engine = args.engine
    this.scene = args.scene
  }

  run() {
    this.scene.actionManager = new BABYLON.ActionManager(this.scene);

    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 100, height: 100}, this.scene);
    const groundMat = new BABYLON.StandardMaterial("groundMat", this.scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.5);
    ground.material = groundMat;
    ground.checkCollisions = true;

    this.player = new Player(this.scene);
    this.player.init(new BABYLON.Vector3(0, 1, 0));
    this.player.setupControls(this.scene.actionManager as BABYLON.ActionManager)

    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
    light.intensity = 0.7;

    var impMat = new BABYLON.StandardMaterial("impMat", this.scene);
    impMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
    var impact = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0, diameterX: 0.15*2, diameterY: 0.01, diameterZ: 0.15*2, updatable: true}, this.scene);
    impact.material = impMat;

    this.scene.onPointerDown = (evt, pickResult) => {
        //console.log(pickResult)
        if (pickResult.hit) {
          impact.position.x = (pickResult.pickedPoint as BABYLON.Vector3).x;
          impact.position.z = (pickResult.pickedPoint as BABYLON.Vector3).z;
          impact.position.y = (pickResult.pickedPoint as BABYLON.Vector3).y;
        }
      }


    this.engine.runRenderLoop(() => {
        if(this.player && this.routerService) {
          this.player.sendMovement(this.routerService);
        }
        if (this.scene) {
            this.scene.render();
        }
    });
  }

  associateRouterService(routerService: RouterService) {
    this.routerService = routerService;
  }

  addRival(key: string, position: BABYLON.Vector3) {
    const newRival = new Rival(this.scene, key);
    newRival.init(position);
    this.rivals[key] = newRival;
  }

  removeRival(key: string) {
    const rival = this.rivals[key];
    if (rival) {
      rival.mesh.dispose();
      delete this.rivals[key];
    }
  }

  updateRival(key: string, position: BABYLON.Vector3) {
    this.rivals[key].update(position);
  }

  updatePlayer(key: string, position: BABYLON.Vector3) {
    this.player.update(position);
  }
}
