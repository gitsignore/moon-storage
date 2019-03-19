const { Router } = require('express');
const { getEvent } = require('./controllers');

const router = Router();

router.get('/', getEvent);

module.exports = router;
