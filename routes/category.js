const express = require('express');
const router = express.Router();
const Joi = require('joi');
const logger = require("../middlewares/logger");

const Category = require("../models/category");

router.post("/",async (req,res)=>{

    const category = new Category({
        name: req.body.name,
        products: req.body.products
    });

    const result = categoryValidate(req.body);

    if(result.error){
        res.send(result.error.details[0].message);
        return;
    }

    try {
        const result = await category.save();
        res.send(result);
    } catch (error) {
        console.log(error);
    }
})

router.put("/:id", async (req,res)=>{
    try {
        const result = categoryValidate(req.body);

        if(result.error){
            return res.send(result.error.details[0].message);
        }

        const category = await Category.findOne({_id:req.params.id});

        category.name = req.body.name;

        await category.save();

        return res.send(category);
    } catch (error) {
        console.log(error);
    }
})

router.delete("/:id",async (req,res)=>{
     try {
        const category = await Category.deleteOne({_id: req.params.id});

        if(category.deletedCount == 0){
            return res.send("Ürün Bulunamadı");
        }
    
        return res.send(`${req.params.id} Numaralı Kategori Silindi`);
    } catch (error) {
        console.log(error);
    }  
})

router.get("/:id",async (req,res)=>{
    try {
        const category = await Category.findOne({_id: req.params.id}).populate("products","name price -_id");
        return res.send(category);
    } catch (error) {
        console.log(error);
    }   
})

router.get("/",async (error,req,res)=>{
    try {
        throw new Error('server hata');
        const result = await Category.find().populate("products","name price -_id");
        res.send(result);
    } catch (error) {
        logger.error(error.message);
    }
})

function categoryValidate(category){
    const schema = new Joi.object().keys({ 
        name: Joi.string().min(3).max(30).required(),
        products: Joi.array()
    });

    return schema.validate(category);
}

module.exports = router;