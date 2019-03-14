require('dotenv').config();
const express = require('express');
const events = require('events');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const logger = require('morgan');
const bodyParser = require('body-parser');
const low = require('lowdb');
const favicon = require('serve-favicon');
const FileAsync = require('lowdb/adapters/FileAsync');
const teamRoutes = require('./components/team/routes');
const userRoutes = require('./components/user/routes');

const app = express();
const server = app.listen(process.env.PORT || 8080);
const io = require('socket.io')(server);

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

app.use((req, res, next) => {
  const adapter = new FileAsync(`${__dirname}/../data/db.json`);

  low(adapter)
    .then(db => {
      db.defaults({ teams: [] }).write();
      return db;
    })
    .then(db => {
      res.locals.db = db;

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
      next();
    });

  res.locals.em = em;
});

const router = express.Router({ mergeParams: true });

router.use('/teams', teamRoutes);
router.use('/teams/:teamId/users', userRoutes);
app.use('/', router);
app.use(
  '/',
  router.get('/', (req, res) => res.json('Welcome to Moon-Storage'))
);
