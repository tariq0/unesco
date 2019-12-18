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

module.exports = isStringInArray;