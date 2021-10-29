import { IHired, Knowledge } from "../types/hired";
import { db } from "../../db";

export const create = (
  hired: IHired,
  knowledge: Knowledge
) => {
  const queryString =
    "INSERT INTO hired_knowledges (id_hired, id_knowledges) VALUES (?,?)";

  db.query(queryString, [hired.id, knowledge.id], (err, result) => {
    if (err) return;
  });
};
