"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
// Create Express server
const app = express_1.default();
app.set('port', process.env.PORT || 4000);
app.use(express_1.default.static(path_1.default.join(__dirname, '/../client/build')));
app.use(express_1.default.static(path_1.default.join(__dirname, '/../assets')));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(morgan_1.default('combined'));
app.use(cors_1.default());
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '/../client/build/index.html'));
});
exports.default = app;
//# sourceMappingURL=app.js.map