const express = require('express');
const {
  getUsers, postUsers, getUser, putUser, deleteUser
} = require('./controllers');
const userSchema = require('./schema.js');

const router = express.Router({ mergeParams: true });

router.get('/', getUsers);
router.post('/', userSchema({ checkId: false }), postUsers);
router.get('/:userId', getUser);
router.put('/:userId', userSchema(), putUser);
router.delete('/:userId', userSchema({ onlyId: true }), deleteUser);

module.exports = router;
