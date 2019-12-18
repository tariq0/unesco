

module.exports = function errHandler(err, req, res, next){

    console.log('error happened: ', err);
    //its supposed to log errors
    switch (err.name) {
        case 'ValidationError':
            res.statusCode = 422;
            break;

        case 'CastError':
            err.message = 'please check youre input types';
            res.statusCode = 422;
             break;

        case 'MongoError':
            res.statusCode = 422;
            err.message = `"${Object.keys(err.keyValue)[0]}" value already in use please choose another value`;
            break;
        
    
        case 'MongoTimeoutError':
            err.message = 'connection error please report it to our admins.';
            res.statusCode = 500;
            break;

        case 'NotFoundError':
            res.statusCode = 404;
            break;
            
        case 'ConflictError':
            res.statusCode = 422;
            break;
        
        default:
            res.statusCode = 500;
            break;
    }
    res.json({message: err.message, error: err});
}