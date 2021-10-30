import { IHiredRegistered, Knowledge } from "../types/hired";
import { db } from "../../db";

//Função para criar a ligação entre contratado e conhecimento
export const create = (
  hired: IHiredRegistered,
  knowledge: Knowledge
) => {
  const queryString =
    "INSERT INTO hired_knowledges (id_hired, id_knowledges) VALUES (?,?)";

  db.query(queryString, [hired.id, knowledge.id], (err, result) => {
    if (err) return;
  });
};
