const express = require('express');
const router = express.Router();
const Joi = require("joi");
const bcypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const User = require("../models/user")

router.post("/create",async(req,res)=>{
    try {
        const result = createUserValidation(req.body);

        if(result.error){
            return res.send(result.error.details[0].message);
        }

        const hashedPassword = await bcypt.hash(req.body.password,10);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            isAdmin: req.body.isAdmin
        });

        await user.save();
        
        const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin },"mysecretKey");

        res.header("x-auth-token",token);

        res.send(user);
    } catch (error) {
        console.log(error);
    }
})

router.post("/login",async(req,res)=>{
    try {
        const result = authUserValidation(req.body);

        if(!result){
            console.log(result.error.details[0].message);
        }

        const user = await User.findOne({email:req.body.email});

        if(!user){
            return res.status(400).send("E-mail Adresi Hatalı");
        }

        const parolaKontrol = await bcypt.compare(req.body.password,user.password);

        if(!parolaKontrol){
            return res.send("Parola Hatalı");
        }

        const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin },"mysecretKey");

        res.header("x-auth-token",token);

        return res.send(token);
    } catch (error) {
        console.log(error);
    }
})

function createUserValidation(user){
    const schema = Joi.object().keys({
        name:Joi.string(),
        email:Joi.string().min(3).max(30).required(),
        password:Joi.string().required(),
        isAdmin:Joi.boolean()
    });

    return schema.validate(user);
}

function authUserValidation(user){
    const schema = Joi.object().keys({
        email:Joi.string().min(3).max(30).required(),
        password:Joi.string().required()
    });

    return schema.validate(user);
}

module.exports = router;