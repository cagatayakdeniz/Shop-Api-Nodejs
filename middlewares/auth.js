const jwt = require('jsonwebtoken');

module.exports = async(req,res,next)=>{
    const token = req.headers["x-auth-token"];

    if(!token){
        return res.status(404).send("Token Bilgisi Yok.");
    }
    
    try {
        encodedToken = jwt.verify(token,"mysecretKey");
        req.user = encodedToken;
        next();
    } catch (error) {
        return res.status(403).send("Token Bilgisi Yanlış");
    }
}