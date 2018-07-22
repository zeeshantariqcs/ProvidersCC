import express from "express";
import bodyParser from "body-parser";
import * as path from "path";
//const path = require('path');
import {default as config} from "./config/config";
import * as db from "./db";
import Provider from "./controllers/provider";

//Create Providers table if it doesn't exist
db.checkAndCreateTable("Providers", "NPINumber", "N", (resp) => {
    console.log(`response is this ${resp}`);
});


let resources = path.join(__dirname, '../', 'resources');

let app = express();

app.set("port", process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(resources, 'views'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(resources, 'web')));
app.use('/node_modules', express.static(path.join(__dirname, '../', 'node_modules')));


app.get('/', (req, res, next) => {
    res.render('index');
});

// app.post('/register', (req, res, next) => {
//     let {firstName, lastName, NPINumber} = req.body;
//     res.render('index', {message: 'You have been successfully registered'});
// });

app.post("/register", Provider.addProvider);

app.listen(app.get("port"), () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("env")
    );
    Provider.cronJob();  //Run Cron Job To Handle NPI Registry Server Down Time
    console.log("  Press CTRL-C to stop\n");
});

export default app;
