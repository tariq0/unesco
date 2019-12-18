

const {User} =  require('../user');


module.exports =  function isAutheticated(req, res, next){

    const authorizationContent = req.get('Authorization');
    if( !authorizationContent){
        res.statusCode = 401;
        return res.json({message: 'not autheticated'});
    }else if(
        authorizationContent.split(' ')[0] !== 'Bearer'
        || !authorizationContent.split(' ')[1]
    ){
        res.statusCode = 401;
        return res.json({message: 'not autheticated'});
    }

    const user = User.verifyToken(authorizationContent.split(' ')[1]);
    if(user){
        req.user = user;
        //console.log(user);
         next();
        //res.json({message: 'you are logged in '});
    }else{
        res.statusCode = 401;
        return res.json({message: 'not autheticated'});
    }    
}