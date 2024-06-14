const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const User = require('../models/User.models.js');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config.js');
const bcrypt = require('bcrypt');
const fetchuser = require('../middleware/fetchuser.middleware.js');


// ROUTE 1: Create user : Post '/api/auth/
router.post('/signup', [
    body('firstName', "First Name should be atleast 2 characters long").isLength({min: 2}),
    body('lastName', "Last Name should be atleast 2 characters long").isLength({min: 2}),
    body('email', "enter a valid email").isEmail(),
    body('password', "atleast 5 charecter long").isLength({min: 5}),

], async(req, res)=>{
    const errors = validationResult(req);
    let success = false;
    if(!errors.isEmpty()){
        return res.status(400).send({success, error: errors.array});
    }

    try{
        //does this email already exist in data base
        let user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).send({success, error: "Email already linked to some other account"});
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const seqPass = await bcrypt.hash(req.body.password, salt);

        //create user
        user = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: seqPass,
            profilePicture: req.body.profilePicture,
            techStack: req.body.techStack,
            programmingLanguages: req.body.programmingLanguages,
            dateOfBirth: req.body.dateOfBirth,
            profession: req.body.profession,
        });

        //send authentication token
        const payload = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(payload, JWT_SECRET);
        success = true;
        res.status(200).send({success, authToken});

    }
    catch(error){
        res.status(500).send({success, error: error.message});
    }
});


//ROUTE 2: login : post /api/auth/login
router.post('/login', [
    body('email', "enter a valid email").isEmail(),
    body('password', "password cannot be empty").exists(),

], async (req, res)=>{
    const error = validationResult(req);
    let success = false;
    if(!error.isEmpty()){
        return res.status(400).send({success, error: error.array});
    }

    try{
        //Allow if user has an account
        let user = await User.findOne({email: req.body.email});
        if(!user){
            return res.status(400).send({success, error: "Invalid credentials"});
        }
        
        //Allow only if user own the account
        const comparePassword = await bcrypt.compare(req.body.password, user.password);
        if(!comparePassword){
            return res.status(400).send({success, error: "Invalid credentails"});
        }

        //send authentication token
        const payload = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(payload, JWT_SECRET);
        success = true;
        res.status(200).send({success,   authToken});
    }
    catch(error){
        res.status(500).send({success, error: error.message});
    }
});

//ROUTE 3: Get logged in user details : post /api/auth/getuser : Login require
router.get('/getuser', fetchuser, async(req,res)=>{
    let success = false;
    const id = req.user.id;
    try{
        let user = await User.findById(id).select("-password");
        success = true;
        res.status(200).send({success, user});
        
    }
    catch(error){
        return res.status(500).json({message: "Internal server Error", error: error.message});
    }

});


// ROUTE 4: Updating user's profile  : put 'api/note/user/' : Login required
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
router.put("/updateuser", fetchuser ,async (req, res) => {
    let success = false;
    try {
        
        const {firstName, lastName, email, profilePicture, password, techStack, programmingLanguages, dateOfBirth, profession} = req.body;
        let user = {};
        if(firstName) user.firstName = firstName;
        if(lastName) user.lastName = lastName;
        if(email) user.email = email;
        if(profilePicture) user.profilePicture = profilePicture;
        if(password) user.password = password;
        if(techStack) user.techStack = techStack;
        if(programmingLanguages) user.programmingLanguages = programmingLanguages;
        if(dateOfBirth) user.dateOfBirth = dateOfBirth;
        if(profession) user.profession = profession;

        if(!validateEmail(user.email)){
            return res.status(400).send({success, error: "Invalid credentials"});
        }

        user = await User.findByIdAndUpdate(req.user.id, {$set: user}, {new: true}).select("-password");
        success = true;
        res.json({ success, user})
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
})


// ROUTE 5: Search others profiles
router.get("/bulk", async (req, res) => {
    const firstNameFilter = req.query.firstName || "";
    const lastNameFilter = req.query.lastName || "";

    const query = {
        $or: []
    };

    //if fist name is provided, find the matching results
    if (firstNameFilter) {
        query.$or.push({
            firstName: {
                "$regex": firstNameFilter,  //regex : regular expressions
                "$options": "i"  // Case-insensitive matching
            }
        })
    }

    //if last nams is provided, find he matching results
    if (lastNameFilter) {
        query.$or.push({
            lastName: {
                "$regex": lastNameFilter,  //regex : regular expressions
                "$options": "i"  // Case-insensitive matching
            }
        })
    }

    const results = await User.find(query);

    res.json({
        user: results.map(user => ({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            id: user.id
        }))
    })
});



module.exports = router;