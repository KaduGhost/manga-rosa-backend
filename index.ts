import * as dotenv from "dotenv";
import express from "express";
import {hiredRouter} from "./src/routes/hired";
import cors from 'cors';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Importação de rotas na aplicação
app.use("/hired", hiredRouter);

//Ligar a aplicação
app.listen(process.env.PORT, () => {
    console.log("Node server started running");
});