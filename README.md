# rest-exercise
A simple restful webservice for managing todo lists.

## Requisitos

* Node (https://nodejs.org/en/download/)
* Conta no Firebase (https://www.firebase.com/)
  * Logar com uma conta google ou criar um novo usuário
  * Criar um novo projeto na tela de boas vindas
  * Definir um nome e escolher uma região
  * Na tela do projeto, clicar em "Adicionar firebase ao seu app da Web"
  * Copiar o código **entre as chaves** e colar no local apropriado do `server.js`

## Executando
```
npm install
npm run server
```

## Exercício

A estrutura dos listas no firebase deve ser a seguinte:

```
{
  lists: {
    list_id_1: {
      name: "List with some todos",
      todos: {
        todo_id_1: {
          title: "First completed todo",
          done: true
        },
        todo_id_2: {
          title: "Second, but yet not done todo",
          done: false
        }
      }
    },
    list_id_2: {
      name: "List without todos",
    }
  }
}
```

Adicione os seguintes endpoints para manipulação dos _todos_:
* Adicionar um novo _todo_ em uma lista
* Recuperar _todos_ de uma lista
* Atualizar um _todo_ de uma lista (marcar como [não] feito; renomear)
* Remover um _todo_ de uma lista
