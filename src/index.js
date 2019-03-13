require('dotenv').config();
const events = require('events');
const { validationResult } = require('express-validator/check');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const logger = require('morgan');
const bodyParser = require('body-parser');
const low = require('lowdb');
const favicon = require('serve-favicon');
const FileSync = require('lowdb/adapters/FileSync');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { userSchema, teamSchema } = require('./schema');

server.listen(process.env.PORT || 8080);

app.use(favicon(`${__dirname}/../public/favicon.ico`));
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN_URI || 'http://localhost:3000',
    methods: ['GET', 'PUT', 'POST', 'DELETE']
  })
);
app.use(bodyParser.json());
app.use(logger('dev'));

const em = new events.EventEmitter();

const adapter = new FileSync(`${__dirname}/../data/db.json`);
const db = low(adapter);
db.defaults({ teams: [] }).write();

em.on('update_teams', () =>
  io.emit(
    'update_teams',
    db
      .get('teams')
      .sortBy('name')
      .value()
  )
);

em.on('update_team', id =>
  io.emit(
    `update_team_${id}`,
    db
      .get('teams')
      .find({ id })
      .value()
  )
);

app.get('/teams', (req, res) => {
  const teams = db
    .get('teams')
    .sortBy('name')
    .value();

  res.send(teams);
});

app.get('/teams/:id', (req, res) => {
  const team = db
    .get('teams')
    .find({ id: req.params.id })
    .value();

  res.send(team);
});

app.post('/teams', teamSchema({ checkId: false }), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const name = req.body.name;

  const alreadyExists = db
    .get('teams')
    .find({ id: name })
    .value();

  if (alreadyExists) {
    return res.status(409).json({
      errors: {
        name: {
          location: 'body',
          param: 'name',
          value: name,
          msg: 'Team already exists'
        }
      }
    });
  }

  const team = db
    .get('teams')
    .push(req.body)
    .last()
    .assign({ id: name })
    .write();

  em.emit('update_teams');

  res.send(team);
});

app.put('/teams/:id', teamSchema(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const id = req.params.id;
  const name = req.body.name;
  const body = req.body;

  if (name !== id) {
    const alreadyExists = db
      .get('teams')
      .find({ id: name })
      .value();

    body.id = name;

    if (alreadyExists) {
      return res.status(409).json({
        errors: {
          name: {
            location: 'body',
            param: 'name',
            value: name,
            msg: `${name} team already exists`
          }
        }
      });
    }
  }

  const team = db
    .get('teams')
    .find({ id })
    .assign(body)
    .write();

  em.emit('update_teams');
  em.emit('update_team', id);

  res.send(team);
});

app.delete('/teams/:id', teamSchema({ onlyId: true }), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const id = req.params.id;
  db.get('teams')
    .remove({ id })
    .write();

  em.emit('update_teams');
  em.emit('update_team', id);

  res.send({ id });
});

app.get('/teams/:id/users', (req, res) => {
  const users = db
    .get('teams')
    .find({ id: req.params.id })
    .get('users')
    .value();

  res.send(users);
});

app.get('/teams/:id/users/:userId', (req, res) => {
  const users = db
    .get('teams')
    .find({ id: req.params.id })
    .get('users')
    .find({ id: req.params.userId })
    .value();

  res.send(users);
});

app.post('/teams/:id/users', userSchema({ checkId: false }), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const id = req.params.id;
  const user = db
    .get('teams')
    .find({ id: id })
    .get('users')
    .push(req.body)
    .last()
    .assign({ id: Date.now().toString() })
    .write();

  em.emit('update_team', id);

  res.send(user);
});

app.put('/teams/:id/users/:userId', userSchema(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const id = req.params.id;
  const user = db
    .get('teams')
    .find({ id: id })
    .get('users')
    .find({ id: req.params.userId })
    .assign(req.body)
    .write();

  em.emit('update_team', id);

  res.send(user);
});

app.delete(
  '/teams/:id/users/:userId',
  userSchema({ onlyId: true }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    const id = req.params.id;
    db.get('teams')
      .find({ id: id })
      .get('users')
      .remove({ id: req.params.userId })
      .write();

    em.emit('update_team', id);

    res.send({ userId: req.params.userId });
  }
);
