const express = require('express');
const router = express.Router();
//validator
const { check,validationResult }= require('express-validator')
//for getting profiles
const gravatar = require('gravatar')
//encrypting password
const bcrypt = require('bcryptjs')
const User = require('../../models/Users')

//@route test/api
//@desc  Test Route
//@access  Public
router.post('/',[
   check('name','Name is Required!!').  //validations for each field
   not().
   isEmpty(),
   check('email','Provide Only Valid Emails!!').isEmail(),
   check('password','Password must be min 8 char long, At least one uppercase,   At least one lower case,').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
], 
async (req, res) => {
    const errors=validationResult(req) ;
    if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()})
    }

    const {name, email, password} = req.body;
    try{
      //Check User Exists
    let user = await User.findOne({email}) //based on what document should be retrieved

    if(user){
     return res.status(400).json({ errors : [{ msg:" User Already Exists!!"}]})
    }
      //gravatar

      const avatar = gravatar.url(email, {
        s:'200',//size
        r:'pg',//rating
        d:'mm'//default
      })
 
    //Instance of user Object
    user = new User({
      name,email,avatar,password
    })
  
   //Password Encryption
    const salt = await bcrypt.genSalt(10); //generating salt

    user.password = await bcrypt.hash(password,salt) //hashing

    await user.save();

    res.send('User Registered')

    } 
    catch(err){
      console.log(err.message);
      return res.status(500).send('Server Error')
    }
    
});



module.exports = router;

