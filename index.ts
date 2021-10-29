import * as dotenv from "dotenv";
import express from "express";
import * as bodyParser from "body-parser";
import {hiredRouter} from "./src/routes/hired";

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use("/hired", hiredRouter);

app.listen(process.env.PORT, () => {
    console.log("Node server started running");
});