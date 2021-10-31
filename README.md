# Manga Rosa Frontend

Um projeto de gerenciamento de contratados feito em NodeJs, utilizando a biblioteca express e banco de dados MySql.
Projeto feito para alimentar o frontend `manga-rosa-frontend`. Você encontra está aplicação clicando [aqui](https://github.com/KaduGhost/manga-rosa-frontend).

# Guia de Instalação

Para iniciar o projeto, você precisa utilizar o ambiente `MySql` que vai servir como banco de dados para este projeto. Você encontra este ambiente clicando [aqui](https://dev.mysql.com/doc/mysql-shell/8.0/en/mysql-shell-install.html).

Após o ambiente MySql devidamento instalado, utilize o seguinte comando para clonar este repositório:

```sh
git clone https://github.com/KaduGhost/manga-rosa-backend
```
Utilize o seguinte comando para ir até a pasta do repositório

```sh
cd manga-rosa-backend
```

Utilize o seguinte comando para instalar as dependências desta aplicação:

```sh
npm install
```

Crie um arquivo .env com:

```sh
PORT=3333
DB_HOST=
DB_USER=
DB_PWD=
DB_NAME=
```
Preencha o arquivo .env com as informações do banco de dados

Após a instalação das dependências e configuração do arquivo .env, utilize o comando a seguir para iniciar a aplicação:

```sh
npm start
```

# Guia de utilização

Este projeto possui 4 rota utilizaveis, veja a descrição delas abaixo.

| Rota                             | Metódo | Descrição                                    |
| -------------------------------- | ------- | -------------------------------------------- |
| `/hired/`                        | `get`  | Está rota serve para buscar todos os contratados válidos |
| `/hired/`                        | `post` | Está rota serve para cadastrar um novo contratado        |
| `/hired/findByName/`             | `get`  | Está rota serve para buscar apenas um contratado pelo seu nome completo |
| `/hired/`                        | `put`  | Está rota serve para editar o status de validação do contratado         |

Objeto de deve ser enviado na rota `/hired/` utilizando o metódo `post`

```sh
{
    "name": "nome completo aqui",
    "phone": "celular aqui",
    "emai": "email aqui",
    "cpf": "cpf aqui",
    "knowledges": ["Git", "React"]
}
```

Objeto que deve ser enviado na rota `/hired/` utilizando o metódo `put`

```sh
{
    "id": "id do contratado",
    "valid": true, (um booleano informando se o contratado está válido ou não)
    "dateValidate": 0, (um número timestamp)
}
```

Parametro que deve ser enviado na rota `/hired/findByName` utilizando o metódo `get`

```sh
/hired/findByName?name=nome completo do colaborador
```

Feito por Carlos Eduardo (KaduGhost)