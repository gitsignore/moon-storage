const { validationResult } = require('express-validator/check');

exports.getUsers = (req, res) => {
  const users = res.locals.db
    .get('teams')
    .find({ id: req.params.teamId })
    .get('users')
    .value();

  res.json(users);
};

exports.getUser = (req, res) => {
  const users = res.locals.db
    .get('teams')
    .find({ id: req.params.teamId })
    .get('users')
    .find({ id: req.params.userId })
    .value();

  res.json(users);
};

exports.postUsers = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const id = req.params.teamId;
  const user = await res.locals.db
    .get('teams')
    .find({ id: id })
    .get('users')
    .push(req.body)
    .last()
    .assign({ id: Date.now().toString() })
    .write();

  res.locals.em.emit('update_team', id);

  res.status(201).json(user);
};

exports.putUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const id = req.params.teamId;
  const user = await res.locals.db
    .get('teams')
    .find({ id })
    .get('users')
    .find({ id: req.params.userId })
    .assign(req.body)
    .write();

  res.locals.em.emit('update_team', id);

  res.json(user);
};

exports.deleteUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const id = req.params.teamId;
  res.locals.db
    .get('teams')
    .find({ id })
    .get('users')
    .remove({ id: req.params.userId })
    .write();

  res.locals.em.emit('update_team', id);

  res.send({ userId: req.params.userId });
};
