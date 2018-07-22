"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path = __importStar(require("path"));
const db = __importStar(require("./db"));
const provider_1 = __importDefault(require("./controllers/provider"));
//Create Providers table if it doesn't exist
db.checkAndCreateTable("Providers", "NPINumber", "N", (resp) => {
    console.log(`response is this ${resp}`);
});
let resources = path.join(__dirname, '../', 'resources');
let app = express_1.default();
app.set("port", process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(resources, 'views'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path.join(resources, 'web')));
app.use('/node_modules', express_1.default.static(path.join(__dirname, '../', 'node_modules')));
app.get('/', (req, res, next) => {
    res.render('index');
});
// app.post('/register', (req, res, next) => {
//     let {firstName, lastName, NPINumber} = req.body;
//     res.render('index', {message: 'You have been successfully registered'});
// });
app.post("/register", provider_1.default.addProvider);
app.listen(app.get("port"), () => {
    console.log("  App is running at http://localhost:%d in %s mode", app.get("port"), app.get("env"));
    provider_1.default.cronJob(); //Run Cron Job To Handle NPI Registry Server Down Time
    console.log("  Press CTRL-C to stop\n");
});
exports.default = app;

//# sourceMappingURL=maps/main.js.map
