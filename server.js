import express from 'express';
import firebase from 'firebase';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// - - - { Initialize Firebase } - - - //

const database = firebase.initializeApp({
  apiKey: '<api key>',
  authDomain: '<auth domain>',
  databaseURL: '<database url>',
  storageBucket: '<storage bucket>',
}).database();


// - - - { TODO Lists } - - - //

// Retorna as listas
app.get('/lists', (req, res) => {
  database.ref('lists').once('value')
    .then(snapshot => {
      const data = snapshot.val();
      const lists = Object.keys(data)
        .map(key => ({ id: key, name: data[key].name }));

      res.send(lists)
    });
});

// Adiciona uma lista
app.post('/lists', (req, res) => {
  const { name } = req.body;
  const keyRef = database.ref('lists').push();
  keyRef.set({ name });
  res.send({ name, key: keyRef.key });
});

// Atualiza uma lista
app.put('/lists/:listId', (req, res) => {
  database.ref(`lists/${req.params.listId}`).set(req.body);
  res.send({ ok: true });
});

// Atualiza parte da lista
app.patch('/lists/:listId', (req, res) => {
  database.ref(`lists/${req.params.listId}`).update(req.body);
  res.send({ ok: true });
});

// Remove uma lista
app.delete('/lists/:listId', (req, res) => {
  database.ref(`lists/${req.params.listId}`).set(null);
  res.send({ ok: true });
});




app.listen(3000, () => console.log('Service on port 3000'));
