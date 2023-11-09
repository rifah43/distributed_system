const jwt = require('jsonwebtoken');

module.exports.authenticate= async(req, res, next)=>{
    const {authorization} = req.headers;
    try{
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, "secret");
        const {_id, email, firstname, lastname} = decoded;
        req._id= _id;
        req.email = email;
        req.firstname = firstname;
        req.lastname = lastname;
        next();
    }catch(err){
        res.status(401).json({message: 'Invalid token'});
    }
}