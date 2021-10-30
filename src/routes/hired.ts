import express, { Request, Response } from "express";
import { QueryError } from "mysql2";
import * as hiredModel from "../models/hired";
import { BasicHired, IHired, IHiredUpdate } from "../types/hired";
const hiredRouter = express.Router();

hiredRouter.get("/", async (req: Request, res: Response) => {
  hiredModel.findAll((err: Error, hireds: IHired[]) => {
    if (err) {
      return res.status(500).json({ errorMessage: err.message });
    }
    res.status(200).json({ data: hireds });
  });
});

hiredRouter.get("/findByName", async (req: Request, res: Response) => {
  const { name }: any = req.query;
  hiredModel.findByName(name, (err: Error, hireds: IHired[]) => {
    if (err) {
      return res.status(500).json({ errorMessage: err.message });
    }
    res.status(200).json({ data: hireds });
  });
});

hiredRouter.post("/", async (req: Request, res: Response) => {
  const { name, email, cpf, phone, knowledges, valid, dateValidate } = req.body;

  //criar validação aqui

  let hired: BasicHired = {
    name,
    email,
    cpf,
    knowledges,
    valid,
    dateValidate,
    phone
  };

  hiredModel.create(hired, (err: QueryError, hiredCreated: IHired) => {
    if (err) {
      let error: any = {};
      if (err.code === "ER_DUP_ENTRY") {
        error.message = "CPF já cadastrado";
      }
      return res.status(400).json({ error });
    } else res.status(200).json({ data: hiredCreated });
  });
});

hiredRouter.put("/", async (req: Request, res: Response) => {
  const { id, name, email, cpf, phone, valid, dateValidate } = req.body;

  //criar validação aqui

  let hired: IHiredUpdate = {
    id,
    name,
    email,
    cpf,
    phone,
    valid,
    dateValidate,
  };
  hiredModel.update(hired, (err: Error) => {
    if (err) {
      return res.status(400).json({ errorMessage: err.message });
    }
    res.status(200).json({ message: "updated" });
  });
});

export { hiredRouter };
