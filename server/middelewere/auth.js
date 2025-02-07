const jwt = require('jsonwebtoken');

//middelewere function to decode jwt token to get clerkId

const authUser = async(req,res,next) =>{
    try {
        const {token} = req.headers
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Not Authorized login again'
            })
        }
        const token_decode = jwt.decode(token)
        req.body.clerkId = token_decode.clerkId
        next()

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:error.message})
        
    }
}
module.exports = authUser;
