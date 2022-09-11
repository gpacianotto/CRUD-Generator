const express = require('express')
const bodyParser = require('body-parser');
const {initializeApp} = require('firebase/app');
const signUpFirebase = require('./Auth/firebase-signup');
const signInFirebase = require('./Auth/firebase-signin');
const databaseSync = require('./syncer-db');

const firebaseConfig = require('./Configs/firebase');

databaseSync();


// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);


const app = express()
const port = 3000


app.get('/', (req, res) => {
  res.send('BEM VINDO AO CRUD-GENERATOR !! FAÇA LOGIN EM: "/sign-in" !! CRIE SUA CONTA EM: "/sign-up"')
})

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/sign-in', jsonParser, (req, res) => signInFirebase(req.body, res))

app.post('/sign-up', jsonParser, (req, res) => signUpFirebase(req.body, res))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})