const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/Users')
const { check,validationResult }= require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('config')

//@route Post api/auth
//@desc  Authenticate USer & Get Token
//@access  Public
router.get('/', auth, async (req, res) => {
    try{
     const user =  await User.findById(req.user.id).select('-password') //omits password from retrieving
     res.json(user)
    } catch (err){
        console.log(err.message);
        return res.status(500).send('Server Error! Could Not Retrieve Data!')

    }
}
);

router.post('/',[
    
    check('email','Provide Only Valid Emails!!').isEmail(),
    check('password','Password Required').exists()
 ], 
 async (req, res) => {
     const errors=validationResult(req) ;
     if(!errors.isEmpty()){
       return res.status(400).json({errors:errors.array()})
     }
 
     const {email, password} = req.body;
     try{
       //Check User Exists
     let user = await User.findOne({email}) //based on what document should be retrieved
 
     if(!user){
      return res.status(400).json({ errors : [{ msg:"Invalid Credentials!!"}]})
     }
      //Password Comparison

      const isMatching = await bcrypt.compare(password, user.password)
       
     if(!isMatching){
      return res.status(400).json({ errors : [{ msg:"Invalid Credentials!!"}]})
     }
     //Instance of user Object
    
    const payload= {
      user : {
         id:user.id
      }
    }
 
    jwt.sign(
      payload,
     config.get('jwtSecret'),
     {expiresIn: 400000},
     (err,token) => {
       if(err) throw err;
       res.json({token})
     }
    )
     } 
     catch(err){
       console.log(err.message);
       return res.status(500).send('Server Error')
     }
     
 });
 

module.exports = router;