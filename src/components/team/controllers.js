const { validationResult } = require('express-validator/check');

exports.getTeams = (req, res) => {
  const teams = res.locals.db
    .get('teams')
    .sortBy('name')
    .value();

  res.json(teams);
};

exports.getTeam = (req, res) => {
  const team = res.locals.db
    .get('teams')
    .find({ id: req.params.teamId })
    .value();

  res.json(team);
};

exports.postTeams = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const name = req.body.name;

  const alreadyExists = res.locals.db
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

  const team = await res.locals.db
    .get('teams')
    .push(req.body)
    .last()
    .assign({ id: name })
    .write();

  res.locals.em.emit('update_teams');

  res.status(201).json(team);
};

exports.putTeam = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const id = req.params.teamId;
  const name = req.body.name;
  const body = req.body;

  if (name !== id) {
    const alreadyExists = res.locals.db
      .get('teams')
      .find({ id: name })
      .value();

    body.id = name;

    if (alreadyExists) {
      return await res.status(409).json({
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

  const team = res.locals.db
    .get('teams')
    .find({ id })
    .assign(body)
    .write();

  res.locals.em.emit('update_teams');
  res.locals.em.emit('update_team', id);

  res.json(team);
};

exports.deleteTeam = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const id = req.params.teamId;
  res.locals.db
    .get('teams')
    .remove({ id })
    .write();

  res.locals.em.emit('update_teams');
  res.locals.em.emit('update_team', id);

  res.json({ id });
};
