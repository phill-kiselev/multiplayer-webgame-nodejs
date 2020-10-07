import * as BABYLON from 'babylonjs';
import { RouterService } from './routing/routerService';

export const LEFT: [number, string] = [65, 'a'];
export const RIGHT: [number, string] = [68, 'd'];
export const UP: [number, string] = [87, 'w'];
export const DOWN: [number, string] = [83, 's'];

export class Player {
  private scene: BABYLON.Scene;
  private keyDown: any = {};
  private keyFired: any = {};
  //speed: number = 0.3;
  camera!: BABYLON.ArcRotateCamera;
  mesh: BABYLON.AbstractMesh;
  staff: BABYLON.AbstractMesh;

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.mesh = BABYLON.MeshBuilder.CreateSphere("im", {diameter: 0.2}, this.scene); 
    this.staff = BABYLON.MeshBuilder.CreateSphere("mystaff", {diameter: 0.2}, this.scene);
    const trig = BABYLON.MeshBuilder.CreateCylinder('collider', { diameter: 0.8, height: 1.4 }, this.scene);
    this.loadMage()
  }

  async loadMage() {
    var assetsManager = new BABYLON.AssetsManager(this.scene);
    var meshTask = assetsManager.addMeshTask("Mage", "", "/assets/", "Mages_1to4_babylon.babylon");
    //BABYLON.SceneLoader.ImportMesh("", "../models/", "Mages_1to4_babylon.babylon", scene, function (newMeshes, particleSystems, skeletons) {
    meshTask.onSuccess = (task) => {
      console.log("Loading Mage successed!")
      //task.loadedMeshes[0].position = new BABYLON.Vector3(0,4,0);
      task.loadedMeshes[5].position = this.mesh.position;
      //task.loadedMeshes[0].dispose();
      task.loadedMeshes[1].dispose();
      task.loadedMeshes[2].dispose();
      task.loadedMeshes[3].dispose();
      task.loadedMeshes[4].dispose();
      //task.loadedMeshes[5].dispose();
      task.loadedMeshes[6].dispose();
      task.loadedMeshes[7].dispose();
      this.staff.dispose();
      this.mesh.dispose();
      this.staff = task.loadedMeshes[0];
      this.mesh = task.loadedMeshes[5];
      this.staff.parent = this.mesh;
      this.camera.lockedTarget = this.mesh;
    }
    meshTask.onError = function (task, message, exception) {
        console.log(message, exception);
    }
    assetsManager.load();
  }

  init(position: BABYLON.Vector3) {
    this.camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 4, Math.PI / 5, 15, new BABYLON.Vector3(0,0,1), this.scene);
    //this.camera.speed = this.speed;
    //this.camera.applyGravity = true;
    //this.camera.ellipsoid = new BABYLON.Vector3(1, 0.75, 1);
    //this.camera.checkCollisions = true;
    //this.camera.keysUp = [UP[0]]; // w
    //this.camera.keysDown = [DOWN[0]]; // S
    //this.camera.keysLeft = [LEFT[0]]; // A
    //this.camera.keysRight = [RIGHT[0]]; // D
    //this.camera.setTarget(BABYLON.Vector3.Zero());
    this.camera.lockedTarget = this.mesh;
    //this.mesh.parent = this.camera;
    this.scene.activeCamera = this.camera;

    // This attaches the camera to the canvas
    this.camera.attachControl(
      this.scene.getEngine().getRenderingCanvas() as HTMLCanvasElement,
      true
    );
  }

  private keyDownEvt(keyCode: number) {
    if (!this.keyFired[keyCode]) {
      this.keyDown[keyCode] = true;
      this.keyFired[keyCode] = true;
    }
  }

  private keyUpEvt(keyCode: number) {
    this.keyDown[keyCode] = false;
    this.keyFired[keyCode] = false;
  }

  setupControls(sceneActionManager: BABYLON.ActionManager) {
    [LEFT, RIGHT, UP, DOWN].forEach((control: [number, string]) => {
      sceneActionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          {
            trigger: BABYLON.ActionManager.OnKeyUpTrigger,
            parameter: control[1],
          },
          () => this.keyUpEvt(control[0])
        )
      );
      sceneActionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          {
            trigger: BABYLON.ActionManager.OnKeyDownTrigger,
            parameter: control[1],
          },
          () => this.keyDownEvt(control[0])
        )
      );
    });
  }

  sendMovement(router: RouterService) {
    if (
      this.keyDown[UP[0]] ||
      this.keyDown[DOWN[0]] ||
      this.keyDown[LEFT[0]] ||
      this.keyDown[RIGHT[0]]
    ) {
      const direction: BABYLON.Vector3 = this.mesh
        .getFacetPosition(1)
        .subtract(this.mesh.position);
      router.sendMovement(
        new BABYLON.Vector2(direction.x, direction.z).normalize(),
        this.keyDown[UP[0]],
        this.keyDown[DOWN[0]],
        this.keyDown[LEFT[0]],
        this.keyDown[RIGHT[0]]
      );
    }
  }

  update(position: BABYLON.Vector3) {
    this.mesh.position.x = position.x;
    this.mesh.position.z = position.z;
  }
}
