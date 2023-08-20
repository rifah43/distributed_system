const mongoose= require('mongoose');
const bcrypt= require('bcryptjs');
const jwt= require('jsonwebtoken');

const userSchema=  new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});
const User = mongoose.model("Users", userSchema);

module.exports = User;

module.exports.registration=  async(req,res)=>{
    const salt= await bcrypt.genSalt(10);
    const hashed= await bcrypt.hash(req.body.password,salt);
    const ifMail= await User.findOne({email:req.body.email});

    if(ifMail){
        return res.status(400).send({
            message:"Email already exists!"
        })
    }

    const user= new User({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email,
        password:hashed
    })

    const result= await user.save();
    
    res.status(201).send({
        message: "Registration successful"
    });
}

module.exports.login=  async(req,res)=>{
    try {
        const ifMail= await User.findOne({email:req.body.email});

    if(!ifMail){
        return res.status(404).send({
            message:"No user found!"
        })
    }

    if(!(await bcrypt.compare(req.body.password, ifMail.password))){
        return res.status(400).send({
            message:"Enter correct password!"
        })
    }       
      const accessToken = jwt.sign(ifMail.toJSON(), "secret",{ expiresIn: '1h' });
      
        res.json({
         token: accessToken,
         _id: ifMail._id,
         message: 'Login successful',
         firstname: ifMail.firstname,
         lastname: ifMail.lastname,
         email: ifMail.email,
       });
     } catch (err) {
       res.status(400).json('Error: ' + err);
     }
}
