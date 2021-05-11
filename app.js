const express = require("express");
const app = express();
require("dotenv").config();
//start up
require("./api/startUp/db_connection")(app);
require("./api/startUp/api_routes")(app);
