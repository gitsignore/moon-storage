const { Router } = require('express');
const {
  getTeams, postTeams, getTeam, putTeam, deleteTeam
} = require('./controllers');
const teamSchema = require('./schema.js');

const router = Router();

router.get('/', getTeams);
router.post('/', teamSchema({ checkId: false }), postTeams);
router.get('/:teamId', getTeam);
router.put('/:teamId', teamSchema(), putTeam);
router.delete('/:teamId', teamSchema({ onlyId: true }), deleteTeam);

module.exports = router;
