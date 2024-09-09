import express from "express";
import viewEngine from "./config/viewEngine"
import initWebRoutes from "./route/web"
import connectDB from "./config/connectDB"

require("dotenv").config();
let app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

viewEngine(app);
initWebRoutes(app);

// connectDB();

let port = process.env.PORT || 6969;
app.listen(port, () =>{
    console.log("Running server at port:", port);
})