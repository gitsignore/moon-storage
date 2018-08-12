const events = require('events');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('morgan');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(8080);

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(logger('dev'));

const em = new events.EventEmitter();

const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ users: [] }).write();

em.on('update', () => io.emit('refresh', db.get('users').value()));

app.get('/users', (req, res) => {
  const users = db.get('users').value();

  res.send(users);
});

app.get('/users/:id', (req, res) => {
  const user = db
    .get('users')
    .find({ id: req.params.id })
    .value();

  res.send(user);
});

app.post('/users', (req, res) => {
  const user = db
    .get('users')
    .push(req.body)
    .last()
    .assign({ id: Date.now().toString() })
    .write();

  em.emit('update');

  res.send(user);
});

app.put('/users/:id', (req, res) => {
  const user = db
    .get('users')
    .find({ id: req.params.id })
    .assign(req.body)
    .write();

  em.emit('update');

  res.send(user);
});

app.delete('/users/:id', (req, res) => {
  db.get('users')
    .remove({ id: req.params.id })
    .write();

  em.emit('update');

  res.send({ id: req.params.id });
});
