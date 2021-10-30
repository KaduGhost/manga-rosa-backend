export interface BasicHiredId {
  id: number;
}

export interface BasicHired {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  valid: boolean;
  dateValidate: number;
  knowledges: string[];
}

export interface IHired extends BasicHired, BasicHiredId {}

export type IHiredPreview = Omit<IHired, "id">;
export type IHiredRemovedDateValidate = Omit<IHiredPreview, "dateValidate">

export interface IHiredRegister extends IHiredRemovedDateValidate {
  cpfValid: boolean;
}

export interface IHiredRegistered extends IHiredRemovedDateValidate {
  cpfValid: boolean;
  id: string;
}

export interface IHiredUpdate extends BasicHiredId {
  valid: boolean;
  dateValidate: number;
}

export interface Knowledge extends BasicKnowledge {
  id: number;
}

export interface BasicKnowledge {
  name: string;
}

export interface hiredKnowledge {
  id_hired: number;
  id_kwowledges: number;


}
