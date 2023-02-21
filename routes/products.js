const express = require('express');
const router = express.Router();
const Joi = require('joi');

const { Product, Comment} = require("../models/product");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

router.post("/",async (req,res)=>{

    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        isActive: req.body.isActive,
        category: req.body.category,
        comments: req.body.comments
    });

    const result = productValidate(req.body);

    if(result.error){
        res.send(result.error.details[0].message);
        return;
    }

    try {
        const result = await product.save();
        res.send(result);
    } catch (error) {
        console.log(error);
    }
})

router.put("/comment/:id", async (req,res)=>{
    try {
        const result = commentValidate(req.body);

        if(result.error){
            return res.send(result.error.details[0].message);
        }

        const product = await Product.findOne({_id:req.params.id});
        
        const comment = new Comment({
            text: req.body.text,
            username: req.body.username
        });
        
        product.comments.push(comment);

        await product.save();

        return res.send(product);
    } catch (error) {
        console.log(error);
    }
})

router.delete("/comment/:id",async (req,res)=>{
    try {
        const product = await Product.findOne({_id:req.params.id});

        const comment = product.comments.find(comment => comment._id == req.body.commentid);
        comment.remove();

        await product.save();
        res.send(product);
    } catch (error) {
        console.log(error);
    }  
})

router.put("/:id", async (req,res)=>{
    try {
        const result = productValidate(req.body);

        if(result.error){
            return res.send(result.error.details[0].message);
        }

        const product = await Product.findOne({_id:req.params.id});

        product.description = req.body.description;
        product.name = req.body.name;
        product.price = req.body.price;
        product.imageUrl = req.body.imageUrl;
        product.isActive = req.body.isActive;

        await product.save();

        return res.send(product);
    } catch (error) {
        console.log(error);
    }
})

router.delete("/:id",async (req,res)=>{
     try {
        const product = await Product.deleteOne({_id: req.params.id});

        if(product.deletedCount == 0){
            return res.send("Ürün Bulunamadı");
        }
    
        return res.send(`${req.params.id} Numaralı Ürün Silindi`);
    } catch (error) {
        console.log(error);
    }  
})

router.get("/:id", (auth), (isAdmin), async (req,res)=>{
    try {
        const product = await Product.findOne({_id: req.params.id}).populate("category","name -_id");
        return res.send(product);
    } catch (error) {
        console.log(error);
    }   
})

router.get("/", (auth), async (req,res)=>{
    try {
        // const result = await Product.find({price:5000,isActive:true}).select({name:1,price:1}); //İstenilen Sütunlar ve Koşullar
        const result = await Product.find().populate("category","name -_id");
        res.send(result);
    } catch (error) {
        console.log(error);
    }
})

function productValidate(product){
    const schema = new Joi.object().keys({ 
        name: Joi.string().min(3).max(30).required(),
        price: Joi.number().integer(), 
        description: Joi.string().required(),
        imageUrl: Joi.string().required(),
        isActive: Joi.boolean().required(),
        category:Joi.string(),
        comments: Joi.array()
    });

    return schema.validate(product);
}

function commentValidate(comment){
    const schema = new Joi.object().keys({ 
        text: Joi.string().min(3).max(30).required(),
        username: Joi.string().required() 
    });

    return schema.validate(comment);
}

module.exports = router;