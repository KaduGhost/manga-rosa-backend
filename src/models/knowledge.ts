import { Knowledge } from "../types/hired";
import { db } from "../../db";
import { RowDataPacket } from "mysql2";

//Função para buscar um conhecimento cadastrado no banco de dados
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
