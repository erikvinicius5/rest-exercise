import express from 'express';
import firebase from 'firebase';
import bodyParser from 'body-parser';

// esta variável `app` será o nosso webservice
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// - - - { Initialize Firebase } - - - //

// a configuração e inicialização do banco de dados do firebase
const database = firebase.initializeApp({
  apiKey: '<api key>',
  authDomain: '<auth domain>',
  databaseURL: '<database url>',
  storageBucket: '<storage bucket>',
}).database();


// - - - - - - - { TODO Lists } - - - - - - - //


// - - # Retorna as listas # - - //

// os métodos com as mesmas assinaturas das ações REST receberão 2 parâmetros
// o primeiro é a uri disponibilizada para requisição
// o segundo é uma função para lidar com a requisição
//
// aqui a função, escrita como _arrow function_ está expondo dois parâmetros
// o primeiro para lidar com os dados da requisição
// o segundo para enviar a resposta ao cliente
app.get('/lists', (req, res) => {

  // o método ref serve para pegar a referência do objeto que queremos
  // para fazer a leitura desse objeto, chamamos o `.once('value')`
  //
  // o once retorna uma "promessa" a ser acessada pelo método `then`
  // mandando uma função (que recebe o valor retornado) como parâmetro
  database.ref('lists').once('value')
    .then(snapshot => {
      // `snapshot` é referência do objeto `lists`
      // o objeto em si é recuperado pelo método `val()`
      const data = snapshot.val();

      // tudo no firebase são objetos
      // esse `Object.keys` vai retornar uma lista das chaves do objeto recebido
      // ex: `Object.keys({ a: 'valor a', b: 'valor b' }) === ['a', 'b'];`
      //
      // rodamos o `.map` na lista de chaves do objeto para transformar
      // a lista de chaves em lista de objetos do formato `{ id, name }`.
      const lists = Object.keys(data)
        .map(key => ({ id: key, name: data[key].name }));

      // por fim, as listas são enviadas como resposta
      res.send(lists)
    });
});


// - - # Adiciona uma lista # - - //
app.post('/lists', (req, res) => {

  // `req.body` é o objeto enviado pelo _post_ no formato `{ name: 'valor' }`
  // a linha abaixo é o mesmo que `const name = req.body.name;`
  const { name } = req.body;

  // no firebase, para adicionar um objeto, você gera primeiro uma referência
  const objRef = database.ref('lists').push();

  // aqui está sendo setado o conteúdo do objeto gerado acima
  // a declaração do objeto está em es6, é _syntatic sugar_ para `{ name: name }`
  objRef.set({ name });

  // isto será o retornado pelo webservice, o nome dado e a chave gerada
  // a chave será necessária para atualizar o objeto futuramente
  res.send({ name, key: objRef.key });
});


// - - # Atualiza uma lista # - - //

// aqui o express vai dar _match_ na ação PUT em uris do formato `/lists/<qualquer-coisa>`
// esse `:listId` será passado para a função como req.params.listId
app.put('/lists/:listId', (req, res) => {

  // primeiro pegamos a referência do objeto que queremos
  // a sintaxe abaixo é de _template string_
  // o resultado seria o mesmo que `'lists/' + req.params.listId`
  // depois de pegar a referência, o corpo recebido pelo PUT é setado diretamente
  database.ref(`lists/${req.params.listId}`).set(req.body);

  // aqui respondemos que a operação foi realizada com sucesso
  res.send({ ok: true });
});

// Atualiza parte da lista
app.patch('/lists/:listId', (req, res) => {

  // a diferença entre o `update` visto aqui é o `set` acima
  // é que o `update` vai mesclar a informação enviada com a presente no banco
  // ex: `{ a: 1, b: 2 }.update({ b: 3, c: 4 }) === { a: 1, b: 3, c: 4 }`
  database.ref(`lists/${req.params.listId}`).update(req.body);
  res.send({ ok: true });
});

// Remove uma lista
app.delete('/lists/:listId', (req, res) => {

  // esse é o modo de deletar objeto no firebase, seta seu valor como `null`
  database.ref(`lists/${req.params.listId}`).set(null);
  res.send({ ok: true });
});




app.listen(3000, () => console.log('Service on port 3000'));
