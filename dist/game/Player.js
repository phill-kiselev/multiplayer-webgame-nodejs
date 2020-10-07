"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const BABYLON = __importStar(require("babylonjs"));
class Player {
    constructor(scene, id) {
        this.speed = 0.15;
        this.scene = scene;
        this.id = id;
    }
    init(position) {
        this.playerMesh = BABYLON.MeshBuilder.CreateCylinder(`player_${this.id}`, { diameter: 0.8, height: 1.4 }, this.scene);
        this.playerMesh.checkCollisions = true;
        this.playerMesh.position = position;
        // This mesh is used to trigger actions on intersection
        this.actionTriggerBox = BABYLON.MeshBuilder.CreateCylinder('collider', { diameter: 0.8, height: 1.4 }, this.scene);
        this.actionTriggerBox.parent = this.playerMesh;
        this.actionTriggerBox.actionManager = new BABYLON.ActionManager(this.scene);
    }
    getActionManager() {
        return this.actionTriggerBox.actionManager;
    }
    applyMovement(data) {
        //console.log(typeof data)
        //console.log(data.direction)
        const direction = data.direction;
        const up = new BABYLON.Vector2(direction.x, direction.y);
        const down = new BABYLON.Vector2(-direction.x, -direction.y);
        const left = new BABYLON.Vector2(-direction.y, direction.x);
        const right = new BABYLON.Vector2(direction.y, -direction.x);
        let moveDir = new BABYLON.Vector2(0, 0);
        if (data.keyUp) {
            moveDir.addInPlace(up);
        }
        if (data.keyDown) {
            moveDir.addInPlace(down);
        }
        if (data.keyLeft) {
            moveDir.addInPlace(left);
        }
        if (data.keyRight) {
            moveDir.addInPlace(right);
        }
        moveDir = moveDir.normalize();
        moveDir.scaleInPlace(this.speed);
        this.playerMesh.moveWithCollisions(new BABYLON.Vector3(moveDir.x, 0, moveDir.y));
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map