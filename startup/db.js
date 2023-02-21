const mongoose = require('mongoose');
const logger = require("../middlewares/logger");
const config = require("config");

const username = config.get("db.username");
const password = process.env.DB_PASSWORD;
const database = config.get("db.name");

module.exports = async function(){
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.uutveqq.mongodb.net/${database}?retryWrites=true&w=majority`)
        console.log("MongoDb bağlantısı başarılı");
        logger.info('Veritabanı bağlantısı başarılı');
    } catch (error) {
        console.log(error);
    }
}