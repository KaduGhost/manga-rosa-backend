import { IHiredRegister } from '../src/types/hired';
import yup from './validator';

//Objeto com funções para validação do contratado
const candidateRegister = {
    
    //Função para validar informações obrigatórias do contratado
    validator: yup.object().shape({
        name: yup.string().required().label("Nome completo").max(100),
        email: yup.string().email().required().label("Email").max(100),
        cpf: yup.string().required().label("CPF").length(14).when("cpfValid", {
            is: false,
            then: yup.string().length(18, "inválido")
        })
    }),

    //Função para validar informção não obrigatórias quando são informadas
    phoneValidator: yup.object().shape({
        phone: yup.string().label("Celular").length(11)
    })
}

//Função que valida um objeto contratado
const validator = async function (validate: IHiredRegister) {
    try {
        await candidateRegister.validator.validate(validate);
        if (validate.phone) await candidateRegister.phoneValidator.validate(validate);
        if (validate.knowledges.length == 0) return {valid:false, title: `É necessário escolher algum conhecimento`}
        else if (validate.knowledges.length > 3) return {valid:false, title: `Você só pode escolher até 3 conhecimentos`}
        return { valid: true, title: "valido" }
    } catch (error: any) {
        return { valid: false, title: `${error.params.label} ${error.message}` }
    }
}

export default validator;
