const express = require('express');
const router = express.Router();
const { Mongoose } = require('mongoose');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profiles');
const User = require('../../models/Users');

const { check,validationResult }= require('express-validator')

//@route GET api/profile/me
//@desc  Get current user profile
//@access  Private
router.get('/me', auth, async (req, res) => {

    try{
      const profile = await Profile.findOne({user: req.user.id}).populate('user',['name','avatar'])

      if(!profile){
        res.status(400).json({msg:'There is no profile for this user!!'})
      }

      res.json(profile);
    } catch (err){
   console.log(err.message)
   res.status(500).send("Server Error")
    }

});


//@route POST api/profile
//@desc  Create/Update profile
//@access  Private

router.post('/', [auth,[
check('status','Status is required').not().isEmpty(),
check('skills', 'Skills is Required').not().isEmpty()

]], async (req,res)=> {

    const errors=validationResult(req) ;
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
      }

      
    const {company, website, location,status,skills,bio,experience,education,
          githubusername,youtube,twitter,facebook,linkedin,instagram} = req.body;

    //Build Profile Object & Check fields are getting in
    const profileFields = {};
    profileFields.user= req.user.id;
    if(company)profileFields.company= company
    if(website)profileFields.website= website
    if(location)profileFields.location= location
    if(status)profileFields.status= status
    if(bio)profileFields.bio= bio
    if(githubusername)profileFields.githubusername= githubusername
     //skills array
    if(skills){
        profileFields.skills= skills.split(',').map(skill=> skill.trim()) //removes white spaces from string
    }
     //Social Object
     profileFields.social ={}
     if(youtube)profileFields.social.youtube= youtube;
     if(twitter)profileFields.social.twitter= twitter;
     if(facebook)profileFields.social.facebook= facebook;
     if(linkedin)profileFields.social.linkedin= linkedin;
     if(instagram)profileFields.social.instagram= instagram;

     try{
     
        let profile = await Profile.findOne({user: req.user.id})

        if(profile){
         //Update
         profile = await Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new:true})
         return res.json(profile)
        }

        //Create
        profile = new Profile(profileFields);
         await profile.save();
         return res.json(profile)
     } catch(err){
         console.log(err.message)
        res.status(500).send('Server Error')
        }
    
})

//@route GET api/profile
//@desc  Get All user profile
//@access  Public

router.get('/', async (req,res) => {
  try {
    const profiles = await Profile.find().populate('user',['name','avatar'])
     res.json(profiles)

    
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error")
    
  }
})

module.exports = router;