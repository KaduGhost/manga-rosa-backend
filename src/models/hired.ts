import { BasicHired, IHired, IHiredUpdate, Knowledge } from "../types/hired";
import { db } from "../../db";
import { OkPacket, RowDataPacket } from "mysql2";
import * as hired_knowledgeModel from "../models/hired_knowledge";
import * as knowledgeModel from "../models/knowledge";

const extractHireds = (result: RowDataPacket[]) => {
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
    const hiredExtracted: IHired = {
      id: row.id,
      cpf: row.cpf,
      email: row.email,
      name: row.name,
      knowledges: [row.knowledge_name],
      valid: row.valid,
      dateValidate: row.date_validate,
    };
    if (row.phone !== "") hiredExtracted.phone = row.phone;
    addHired(hiredExtracted);
  });
  return hireds;
};

export const create = async (hired: BasicHired, callback: Function) => {
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

      const insertId = (<OkPacket>result).insertId;

      const hiredAdded: IHired = {
        ...hired,
        id: insertId,
      };

      hired.knowledges.forEach((knowledge) => {
        try {
          knowledgeModel.findOne(knowledge, (err: Error, know: Knowledge) => {
            if (know) {
              hired_knowledgeModel.create(hiredAdded, know);
            }
          });
        } catch (err) {
          return;
        }
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
    } else {
      const hiredsExtracted = extractHireds(<RowDataPacket[]>result);
      callback(null, hiredsExtracted[0]);
    }
  });
};

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

export const update = async (hired: IHiredUpdate, callback: Function) => {
  const queryString =
    "UPDATE hired SET valid = ?, date_validate = ? WHERE id = ?";
  db.query(
    queryString,
    [
      hired.valid,
      hired.dateValidate,
      hired.id,
    ],
    (err, result) => {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    }
  );
};
