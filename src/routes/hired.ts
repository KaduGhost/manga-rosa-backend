import express, { Request, Response } from "express";
import { QueryError } from "mysql2";
import * as hiredModel from "../controllers/hired";
import { IHired, IHiredRegister, IHiredUpdate } from "../types/hired";
import * as CpfValidator from "cpf-cnpj-validator";
import { checkCandidate } from "../../validators";

const hiredRouter = express.Router();

//Rota para buscar todos os contratados validos ( que possuem conhecimentos cadastrados )
hiredRouter.get("/", async (req: Request, res: Response) => {
  hiredModel.findAll((err: Error, hireds: IHired[]) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.status(200).json({ data: hireds });
  });
});

//Rota para buscar apenas um contratado valido pelo nome
hiredRouter.get("/findByName", async (req: Request, res: Response) => {
  const { name }: any = req.query;
  hiredModel.findByName(name, (err: Error, hireds: IHired[]) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.status(200).json({ data: hireds });
  });
});

//Rota para cadastrar um novo contratado
hiredRouter.post("/", async (req: Request, res: Response) => {
  const { name, email, cpf, phone, knowledges, valid } = req.body;

  //Função para validação de cpf
  const cpfValid = CpfValidator.cpf.isValid(cpf);

  //Objeto enviado pela rota e que será usada para a validação completa
  let hired: IHiredRegister = {
    name,
    email,
    cpf,
    knowledges,
    valid,
    phone,
    cpfValid,
  };

  //Função que valida todos os campos
  let result = await checkCandidate(hired);


  if (result.valid) {
    hiredModel.create(hired, (err: QueryError, hiredCreated: IHired) => {
      if (err) {
        let error: any = {};
        if (err.code === "ER_DUP_ENTRY") {
          error.message = "CPF já cadastrado";
        }
        return res.status(400).json({ error });
      } else res.status(200).json({ data: hiredCreated });
    });
  } else {
    let error: any = {
      message: result.title,
    };
    res.status(400).json({ error });
  }
});


//Rota para dar update no contratado
hiredRouter.put("/", async (req: Request, res: Response) => {
  const { id, valid, dateValidate } = req.body;

  //Objeto enviado pela rota
  let hired: IHiredUpdate = {
    id,
    valid,
    dateValidate,
  };

  hiredModel.update(hired, (err: Error) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    } else res.status(200).json({ message: "updated" });
  });
});

export { hiredRouter };
