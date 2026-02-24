const express = require('express');
const router = express.Router();
const { logProgress, getProgressAnalytics } = require('../controllers/progressController');

router.post('/:userId', logProgress);
router.get('/:userId', getProgressAnalytics);

module.exports = router;