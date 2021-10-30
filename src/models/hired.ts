import {
  IHired,
  IHiredRegister,
  IHiredRegistered,
  IHiredUpdate,
  Knowledge,
} from "../types/hired";
import { db } from "../../db";
import { OkPacket, RowDataPacket } from "mysql2";
import * as hired_knowledgeModel from "../models/hired_knowledge";
import * as knowledgeModel from "../models/knowledge";

//Função usada para extrair os contratados do result das querys
const extractHireds = (result: RowDataPacket[]) => {
  const rows = <RowDataPacket[]>result;
  const hireds: IHired[] = [];

  //Função para adicionar os contratados diretamente no array
  const addHired = (hired: IHired) => {
    let hiredFind = hireds.find((hire) => hire.id === hired.id);
    if (hiredFind) {
      hiredFind.knowledges.push(hired.knowledges[0]);
    } else {
      hireds.push(hired);
    }
  };

  rows.forEach((row) => {
    //Objeto extraido da linha da consulta
    const hiredExtracted: IHired = {
      id: row.id,
      cpf: row.cpf,
      email: row.email,
      name: row.name,
      knowledges: [row.knowledge_name],
      valid: row.valid,
      dateValidate: row.date_validate,
      phone: row.phone,
    };
    addHired(hiredExtracted);
  });
  return hireds;
};

//Função feita para criar um contratado no banco de dados
export const create = async (hired: IHiredRegister, callback: Function) => {
  const queryString =
    "INSERT INTO hired (name, email, cpf, phone, valid) VALUES (?, ?, ?, ?, ?)";
  db.query(
    queryString,
    [hired.name, hired.email, hired.cpf, hired.phone, hired.valid],
    (err, result) => {
      if (err) {
        callback(err);
        return;
      }

      //ultimo id adicionado
      const insertId = (<OkPacket>result).insertId;

      const hiredAdded: IHiredRegistered = {
        ...hired,
        id: insertId.toString(),
      };

      //Função para fazer a ligação entre contratado e conhecimentos
      hired.knowledges.forEach((knowledge) => {
        knowledgeModel.findOne(knowledge, (err: Error, know: Knowledge) => {
          if (know) {
            hired_knowledgeModel.create(hiredAdded, know);
          }
        });
      });
      callback(null, hiredAdded);
    }
  );
};

//Função para procurar um contratado
export const findOne = (hiredId: number, callback: Function) => {
  const queryString = `
      SELECT 
        o.*,
        p.name AS knowledge_name,
      FROM hired AS o
      INNER JOIN hired_knowledges AS k ON k.id_hired=o.id
      INNER JOIN knowledges AS p ON p.id=k.id_kwowledges
      WHERE o.id=?`;

  db.query(queryString, hiredId, (err, result) => {
    if (err) {
      callback(err);
    } else {
      const hiredsExtracted = extractHireds(<RowDataPacket[]>result);
      callback(null, hiredsExtracted[0]);
    }
  });
};

//Função para procurar um contratado pelo nome
export const findByName = (hiredName: string, callback: Function) => {
  const queryString = `
        SELECT o.*, 
        p.name AS knowledge_name 
        FROM hired AS o 
        INNER JOIN hired_knowledges AS k ON k.id_hired=o.id 
        INNER JOIN knowledges AS p ON p.id=k.id_knowledges
        WHERE o.name=?`;

  db.query(queryString, hiredName, (err, result) => {
    if (err) {
      callback(err);
    } else {
      const hiredsExtracted = extractHireds(<RowDataPacket[]>result);
      callback(null, hiredsExtracted[0]);
    }
  });
};

//Função para pegar todos os contratados validos ( que possuem ao menos 1 conhecimento cadastrado )
export const findAll = (callback: Function) => {
  const queryString = `
        SELECT o.*, 
        p.name AS knowledge_name 
        FROM hired AS o 
        INNER JOIN hired_knowledges AS k ON k.id_hired=o.id 
        INNER JOIN knowledges AS p ON p.id=k.id_knowledges`;
  db.query(queryString, (err, result) => {
    if (err) {
      callback(err);
    } else {
      const hiredsExtracted = extractHireds(<RowDataPacket[]>result);
      callback(null, hiredsExtracted);
    }
  });
};


//Função para atualizar um contratado
export const update = async (hired: IHiredUpdate, callback: Function) => {
  const queryString =
    "UPDATE hired SET valid = ?, date_validate = ? WHERE id = ?";
  db.query(
    queryString,
    [hired.valid, hired.dateValidate, hired.id],
    (err, result) => {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    }
  );
};
