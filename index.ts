import * as dotenv from "dotenv";
import express from "express";
import {hiredRouter} from "./src/routes/hired";
import cors from 'cors';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/hired", hiredRouter);

app.listen(process.env.PORT, () => {
    console.log("Node server started running");
});