const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');

// REGISTER
router.post("/register",async (req, res) => { // اشتغلت في الانجلر
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password,salt)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,

        });
        const user = await newUser.save();

        const{username,email, ...others} = user._doc;
        const token = jwt.sign({
            username,email,
                maxAge:'1d'
            }, 'cdgisqekkh74g')
            res.status(200).json(token);
        // res.status(200).json(user);
    } catch (error) {
        res.status(500).json('Name or Email is used , try different data !')
        // res.status(500).json(error)
    }
})

// LOGIN
router.post("/login", async (req, res) => { // اشتغلت في الانجلر
    try {
        const user = await User.findOne({username: req.body.username});
        if(!user){
            !user && res.status(400).json("wrong data!");
            return;    
        }
        
        const validated = await bcrypt.compare(req.body.password, user.password);
        if(!validated){
            res.status(400).json("wrong data!");
            return;   
        }else{
            const{username,email, ...others} = user._doc;
            const token = jwt.sign({
                username,email,
                    maxAge:'1d'
                }, 'cdgisqekkh74g')
                // return token;
                res.status(200).json(token);
        }
        
    } catch (error) {
        res.status(500).json(error);
    }
})

// router.post("/login", async (req, res) => { // اشتغلت في الانجلر
//     try {
//         const user = await User.findOne({username: req.body.username});
//         if(!user){
//             !user && res.status(400).json("wrong data!");
//             return;    
//         }
        
//         const validated = await bcrypt.compare(req.body.password, user.password);
//         if(!validated){
//             res.status(400).json("wrong data!");
//             return;   
//         }

//         const{password, ...others} = user._doc;
//         res.status(200).json(others);
//     } catch (error) {
//         res.status(500).json(error);
//     }
// })



module.exports = router;