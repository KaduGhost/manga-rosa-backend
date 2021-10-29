import { BasicHired, IHired, Knowledge } from "../types/hired";
import { db } from "../../db";
import { OkPacket, RowDataPacket } from "mysql2";
import * as hired_knowledgeModel from "../models/hired_knowledge";
import * as knowledgeModel from "../models/knowledge";

export const create = async (hired: BasicHired, callback: Function) => {
  const queryString =
    "INSERT INTO hired (name, email, cpf, phone) VALUES (?, ?, ?, ?)";
  db.query(
    queryString,
    [hired.name, hired.email, hired.cpf, hired.phone],
    (err, result) => {
      if (err) {
        callback(err);
      }

      const insertId = (<OkPacket>result).insertId;

      const hiredAdded: IHired = {
        ...hired,
        id: insertId,
      };

      hired.knowledges.forEach((knowledge) => {
        knowledgeModel.findOne(knowledge, (err: Error, know: Knowledge) => {
          hired_knowledgeModel.create(hiredAdded, know);
        });
      });
      callback(null, hiredAdded);
    }
  );
};

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
    }

    const rows = <RowDataPacket[]>result;
    const hireds: IHired[] = [];

    const addHired = (hired: IHired) => {
      let hiredFind = hireds.find((hire) => hire.id === hired.id);
      if (hiredFind) {
        hiredFind.knowledges.push(hired.knowledges[0]);
      } else {
        hireds.push(hired);
      }
    };

    rows.forEach((row) => {
      const order: IHired = {
        id: row.id,
        cpf: row.cpf,
        email: row.email,
        name: row.name,
        phone: row.phone,
        knowledges: [row.knowledge_name],
      };
      addHired(order);
    });
    callback(null, hireds[0]);
  });
};

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
    }

    const rows = <RowDataPacket[]>result;
    const hireds: IHired[] = [];

    const addHired = (hired: IHired) => {
      let hiredFind = hireds.find((hire) => hire.id === hired.id);
      if (hiredFind) {
        hiredFind.knowledges.push(hired.knowledges[0]);
      } else {
        hireds.push(hired);
      }
    };

    rows.forEach((row) => {
      const order: IHired = {
        id: row.id,
        cpf: row.cpf,
        email: row.email,
        name: row.name,
        phone: row.phone,
        knowledges: [row.knowledge_name],
      };
      addHired(order);
    });
    callback(null, hireds);
  });
};
