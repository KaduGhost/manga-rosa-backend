//Interface basica para representar o contratado
export interface BasicHiredId {
  id: number;
}

//Interface basica do contratado com todas as propriedades
export interface BasicHired {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  valid: boolean;
  dateValidate: number;
  knowledges: string[];
}

//Interface completa do contratado
export interface IHired extends BasicHired, BasicHiredId {}

//Interface básica do contratado com data de validação removida
export type IHiredRemovedDateValidate = Omit<BasicHired, "dateValidate">

//Interface do contratado para registro
export interface IHiredRegister extends IHiredRemovedDateValidate {
  cpfValid: boolean;
}

//Interface do contratado após registro
export interface IHiredRegistered extends IHiredRemovedDateValidate {
  cpfValid: boolean;
  id: string;
}

//Interface básica do contratado para fins de updates
export interface IHiredUpdate extends BasicHiredId {
  valid: boolean;
  dateValidate: number;
}

//Interface do objeto conhecimento do contratado
export interface Knowledge {
  id: number;
  name: string;
}

//Interface do object conhecimento para fins de registro
export type KnowledgeRegister = Omit<Knowledge, "id">;

//Interface para a ligação do contratado com os conhecimentos
export interface hiredKnowledge {
  id_hired: number;
  id_kwowledges: number;


}
