export interface IHired extends BasicHired {
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
