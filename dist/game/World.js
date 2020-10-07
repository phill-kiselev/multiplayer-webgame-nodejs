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
const Player_1 = require("./Player");
const xhr2_1 = require("xhr2");
global.XMLHttpRequest = xhr2_1.XMLHttpRequest;
class World {
    constructor() {
        this.players = {};
        this.engine = new BABYLON.NullEngine();
        this.scene = new BABYLON.Scene(this.engine);
    }
    init() {
        //this.scene.gravity = new BABYLON.Vector3(0, -5, 0);
        this.scene.collisionsEnabled = true;
        const camera = new BABYLON.ArcRotateCamera('Camera', 0, 0.8, 100, BABYLON.Vector3.Zero(), this.scene);
        const ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, this.scene);
        ground.checkCollisions = true;
        this.engine.runRenderLoop(() => {
            if (this.scene) {
                this.scene.render();
            }
        });
    }
    createPlayer(id) {
        const player = new Player_1.Player(this.scene, id);
        const position = new BABYLON.Vector3(this.getRandomNum(-2, 2), 1, this.getRandomNum(-2, 2));
        player.init(position);
        this.players[id] = player;
    }
    removePlayer(id) {
        const player = this.players[id];
        if (player !== undefined) {
            player.playerMesh.dispose();
        }
        delete this.players[id];
    }
    dispose() {
        this.scene.dispose();
    }
    getRandomNum(min, max) {
        return Math.random() * (max - min) + min;
    }
}
exports.World = World;
//# sourceMappingURL=World.js.map