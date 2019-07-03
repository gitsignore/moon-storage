const { validationResult } = require('express-validator');

exports.getUsers = (req, res) => {
  const users = res.locals.db
    .get('teams')
    .find({ id: req.params.teamId })
    .get('users')
    .value();

  return res.json(users);
};

exports.getUser = (req, res) => {
  const user = res.locals.db
    .get('teams')
    .find({ id: req.params.teamId })
    .get('users')
    .find({ id: req.params.userId })
    .value();

  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  return res.json(user);
};

exports.postUsers = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const id = req.params.teamId;
  const user = await res.locals.db
    .get('teams')
    .find({ id })
    .get('users')
    .push(req.body)
    .last()
    .assign({ id: Date.now().toString() })
    .write();

  res.locals.em.emit('update_team', id);

  return res.status(201).json(user);
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

  return res.json(user);
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

  return res.send({ userId: req.params.userId });
};
