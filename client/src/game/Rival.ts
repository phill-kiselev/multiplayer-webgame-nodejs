import * as BABYLON from 'babylonjs';
//import mage from './assets/Mages_1to4_babylon.babylon';

export class Rival {
  private scene: BABYLON.Scene;
  id: string;
  mesh: BABYLON.AbstractMesh;
  staff: BABYLON.AbstractMesh;

  async loadMage() {
    var assetsManager = new BABYLON.AssetsManager(this.scene);
    var meshTask = assetsManager.addMeshTask("Mage", "", "/assets/", "Mages_1to4_babylon.babylon");
    //BABYLON.SceneLoader.ImportMesh("", "../models/", "Mages_1to4_babylon.babylon", scene, function (newMeshes, particleSystems, skeletons) {
    meshTask.onSuccess = (task) => {
      console.log("Loading Mage successed!")
      //task.loadedMeshes[0].position = new BABYLON.Vector3(2,4,2);
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
      //this.mesh.position = new BABYLON.Vector3(0,2,0);
      this.staff.parent = this.mesh;
    }
    meshTask.onError = function (task, message, exception) {
        console.log(message, exception);
    }
    assetsManager.load();
  }

  constructor(scene: BABYLON.Scene, id: string) {
    this.scene = scene;
    this.id = id;
    this.mesh = BABYLON.MeshBuilder.CreateSphere(id, {diameter: 0.2}, this.scene);
    this.staff = BABYLON.MeshBuilder.CreateSphere(id, {diameter: 0.2}, this.scene);
    this.loadMage()
  }

  init(position: BABYLON.Vector3) {
    this.mesh.position = position;
  }

  update(position: BABYLON.Vector3) {
    this.mesh.position = position;
  }
}
