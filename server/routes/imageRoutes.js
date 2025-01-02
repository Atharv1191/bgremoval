const express = require('express')

const {removeBgImage} = require('../controllers/imageController')
const authUser = require('../middelewere/auth'); 
const upload = require('../middelewere/multer');
const router = express.Router();

router.post('/remove-bg',upload.single('image'),authUser,removeBgImage);
module.exports = router;