const express = require('express');
const{clerkWebhooks} = require('../controllers/userController');
const router = express.Router();

router.post('/webhooks',clerkWebhooks);

module.exports = router;