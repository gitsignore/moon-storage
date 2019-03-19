const { Router } = require('express');
const teamRoutes = require('./components/team/routes');
const userRoutes = require('./components/user/routes');
const eventRoutes = require('./components/event/routes');

const router = Router({ mergeParams: true });

router.use('/teams', teamRoutes);
router.use('/teams/:teamId/users', userRoutes);
router.use('/events', eventRoutes);
router.get('/', (req, res) => res.json('Welcome to Moon-Storage'));

module.exports = router;
