import express, {Request, Response} from "express";
import * as hiredModel from "../models/hired";
import {BasicHired, IHired} from "../types/hired";
const hiredRouter = express.Router();

hiredRouter.get("/", async (req: Request, res: Response) => {
  hiredModel.findAll((err: Error, hireds: IHired[]) => {
    if (err) {
      return res.status(500).json({"errorMessage": err.message});
    }

    res.status(200).json({"data": hireds});
  });
});

hiredRouter.get("/findByName", async (req: Request, res: Response) => {

  const { name }:any = req.query;
  
  hiredModel.findByName(name, (err: Error, hireds: IHired[]) => {
    if (err) {
      return res.status(500).json({"errorMessage": err.message});
    }

    res.status(200).json({"data": hireds});
  });
});

hiredRouter.post("/", async (req: Request, res: Response) => {

  const { name, email, cpf, phone, knowledges } = req.body;

  //criar validação aqui

  let hired: BasicHired = {
    name, email, cpf, phone, knowledges
  }

  hiredModel.create(hired, (err: Error, hiredCreated: IHired) => {
    if (err) {
      return res.status(500).json({"errorMessage": err.message});
    }
    res.status(200).json({"data": hiredCreated})
  })
  
});

export {hiredRouter}