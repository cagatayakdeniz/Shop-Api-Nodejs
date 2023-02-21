module.exports = function(req,res,next){
    console.log(req.user);
    if(!req.user.isAdmin){
        return res.send("Erişim İzniniz Yok");
    }
    next();
}