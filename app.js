const express = require('express')
const bodyParser = require('body-parser');
const {initializeApp} = require('firebase/app');
const signUpFirebase = require('./Auth/firebase-signup');
const signInFirebase = require('./Auth/firebase-signin');
const signUp = require('./Auth/signup');
const newSystem = require('./Create/new-system');

const databaseSync = require('./syncer-db');

const firebaseConfig = require('./Configs/firebase');
const signUpMiddleware = require('./Middlewares/sign-up-middleware');
const signIn = require('./Auth/signin');
const signInMiddleware = require('./Middlewares/sign-in-middleware');

databaseSync();


// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);


const app = express()
const port = 3000


app.get('/', (req, res) => {
  res.send('BEM VINDO AO CRUD-GENERATOR !! FAÇA LOGIN EM: "/sign-in" !! CRIE SUA CONTA EM: "/sign-up"')
})

// create application/json parser
var jsonParser = bodyParser.json();

function middlewareTest(req, res, next)
{
  console.log("req:");
  console.log(req.headers);

  next();
}

function test(req, res, next)
{
  res.json({body: req.body});
  return;
}

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/sign-in', jsonParser, signInMiddleware, (req, res) => signIn(req.body, res))

app.post('/sign-up', jsonParser, signUpMiddleware, (req, res) => signUp.signUp(req.body, res))

app.post('/new-system', jsonParser, (req, res) => newSystem(req.body, res));

app.post('/testing', jsonParser, middlewareTest, test);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})