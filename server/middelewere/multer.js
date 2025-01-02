const multer = require('multer');

//creating multer middelewere for parsing image

const storage = multer.diskStorage({
    filename:function(req,file,callback){
        callback(null,`${file.fieldname}_${Date.now()}_${file.originalname}`)
    }
})
const upload = multer({storage})
module.exports = upload;