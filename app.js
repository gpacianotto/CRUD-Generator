const express = require('express')
const bodyParser = require('body-parser');
const signUp = require('./Auth/signup');
const newSystem = require('./Create/new-system');

const databaseSync = require('./syncer-db');

const signUpMiddleware = require('./Middlewares/sign-up-middleware');
const signIn = require('./Auth/signin');
const signInMiddleware = require('./Middlewares/sign-in-middleware');
const authenticators = require('./Middlewares/authenticator');
const cors = require('cors');
const doesRootSystemExists = require('./Checkers/root-system-exists');
const listSystems = require('./List/list-systems');
const listAccounts = require('./List/list-accounts');
const permissionVerifier = require('./Middlewares/permission-verifyer');
const createNewTable = require('./Create/new-table');
const listTables = require('./List/list-tables');
const create = require('./CRUDOperations/create');
const read = require('./CRUDOperations/read');
const list = require('./CRUDOperations/list');
const update = require('./CRUDOperations/update');
const destroy = require('./CRUDOperations/destroy');
const deleteTable = require('./Delete/delete-table');

databaseSync();





const app = express()
const port = 3000

app.use(cors());


app.get('/', (req, res) => {
  res.send('BEM VINDO AO CRUD-GENERATOR !! FAÇA LOGIN EM: "/sign-in" !! CRIE SUA CONTA EM: "/sign-up"')
})

// create application/json parser
var jsonParser = bodyParser.json();


function test(req, res, next)
{
  res.json({body: req.body});
  return;
}

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/sign-in', jsonParser, signInMiddleware, (req, res) => signIn(req.body, res))

app.post('/sign-up', jsonParser, signUpMiddleware, (req, res) => signUp.signUp(req, res))

app.post('/systems/new', jsonParser, authenticators.authSystem, authenticators.authRootUser, (req, res) => newSystem(req.body, res));

app.post(
  '/table/new', 
  jsonParser, 
  authenticators.authSystem, 
  authenticators.authUser, 
  (req, res, next) => permissionVerifier(req, res, next, ['admin']),
  (req, res) => createNewTable(req, res)
)

app.delete(
  '/table/delete/:tableId',
  jsonParser,
  authenticators.authSystem, 
  authenticators.authUser, 
  (req, res, next) => permissionVerifier(req, res, next, ['admin']),
  deleteTable
);

app.get(
  '/table/list',
  jsonParser,
  authenticators.authSystem,
  authenticators.authUser,
  (req, res, next) => permissionVerifier(req, res, next, ['admin']),
  listTables
)

app.get('/systems/list', jsonParser, authenticators.authSystem, authenticators.authRootUser, listSystems);

app.get(
  '/accounts/list', 
  jsonParser, 
  authenticators.authSystem, 
  authenticators.authUser,
  (req, res, next) => permissionVerifier(req, res, next, ['admin', 'root']), 
  listAccounts,
)

app.post(
  '/create/:tableId',
  jsonParser,
  authenticators.authSystem,
  authenticators.authUser,
  (req, res, next) => permissionVerifier(req, res, next, ['admin', 'common-user']), 
  create
)

app.get(
  '/read/:tableId',
  jsonParser,
  authenticators.authSystem,
  authenticators.authUser,
  (req, res, next) => permissionVerifier(req, res, next, ['admin', 'common-user']),
  read
)

app.get(
  '/list/:tableId',
  jsonParser,
  authenticators.authSystem,
  authenticators.authUser,
  (req, res, next) => permissionVerifier(req, res, next, ['admin', 'common-user']),
  list
)

app.put(
  '/update/:tableId',
  jsonParser,
  authenticators.authSystem,
  authenticators.authUser,
  (req, res, next) => permissionVerifier(req, res, next, ['admin', 'common-user']),
  update
)

app.delete(
  '/destroy/:tableId',
  jsonParser,
  authenticators.authSystem,
  authenticators.authUser,
  (req, res, next) => permissionVerifier(req, res, next, ['admin', 'common-user']),
  destroy
)


app.get('/root-system-exists', jsonParser, (req, res) => doesRootSystemExists(req, res));

app.post('/testing', jsonParser, authenticators.authSystem, authenticators.authUser, test);

app.post('/testing123', jsonParser, (req, res) => {
  res.json(req.body);
  return;
});

app.get('/test-api', jsonParser, (req, res) => {
  res.json({
    message: "testing",
    state: "everything ok"
  });
  return;
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})