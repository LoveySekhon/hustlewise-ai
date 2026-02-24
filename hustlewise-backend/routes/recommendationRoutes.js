const express = require('express');
const router = express.Router();
const { getRecommendations, saveUserProfile } = require('../controllers/recommendationController');
router.get('/:userId', getRecommendations);

router.post('/profile/:userId', saveUserProfile);

module.exports = router;