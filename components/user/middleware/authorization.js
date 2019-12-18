// role based authorization

const isStringInArray = function (str, arrOfStrings) {
    if (Array.isArray(arrOfStrings)) {
        if (arrOfStrings.indexOf(str) > -1) {
            return true;
        } else
            return false;
    } else {
        const error =
            new Error('second parameter passed to "isStringInArray()" is not an array..');
        throw error;
    }
    //return 
}


module.exports = function isAuthorized(roles){
    if(typeof roles === "string"){
        return (req, res, next)=>{
            if(req.user.role === roles) return next();
            else{
                res.statusCode = 403;
                return res.json({message: 'youre not authorized'});
            }
        }
    }else if(Array.isArray(roles)){
        return (req, res, next)=>{
            if(isStringInArray(req.user.role, roles))return next();
            else{
                res.statusCode = 403;
                return res.json({message: 'youre not authorized'});
            }
        }
    }
    else{
        const error = new Error();
        error.name = 'ValidationError';
        error.message = 'invalid input type to isauthorized function';
        throw error;
    }
}