import { BasicKnowledge, Knowledge } from "../types/hired";
import { db } from "../../db";
import { OkPacket, RowDataPacket } from "mysql2";

export const create = (knowledge: BasicKnowledge, callback: Function) => {
  const queryString = "INSERT INTO hired (name) VALUES (?)";

  db.query(queryString, [knowledge.name], (err, result) => {
    if (err) {
      callback(err);
    }

    const insertId = (<OkPacket>result).insertId;
    callback(null, insertId);
  });
};

export const findOne = (knowledgeName: string, callback: Function) => {
  const queryString = `SELECT * FROM knowledges WHERE name = ?`;

  db.query(queryString, knowledgeName, (err, result) => {
    if (err) {
      callback(err);
    }

    const row = (<RowDataPacket[]>result)[0];
    if (row) {
      const knowledge: Knowledge = {
        id: row.id,
        name: row.name,
      };
      callback(null, knowledge);
    } else {
      callback(null);
    }
  });
};
