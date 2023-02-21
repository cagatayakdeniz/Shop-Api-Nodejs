const express = require("express");
const productRoute = require("../routes/products");
const categoryRoute = require("../routes/category");
const userRoute = require("../routes/user");
const homeRoute = require("../routes/home");

module.exports = function(app){
    app.use(express.json());
    app.use("/api/product",productRoute);
    app.use("/api/category",categoryRoute);
    app.use("/api/user",userRoute);
    app.use("/",homeRoute);
}