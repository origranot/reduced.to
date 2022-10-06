import express from "express";
import bodyParser from "body-parser";
const app = express();

const APP_PORT = process.env.PORT || 3000;

app.set("view engine", "pug");

app.use(express.static("public"));
app.use(bodyParser.json());

const indexRoutes = require("./routes/index");
const apiRoutes = require("./routes/api");

app.use("/", indexRoutes);
app.use("/api", apiRoutes);

// Declare Globals
//@ts-ignore
global.URL_DICT = {};

app.listen(APP_PORT, () => console.log(`App listening on port ${APP_PORT}!`));
