const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: String,
    products: [{type: mongoose.Schema.Types.ObjectId,ref:'Product'}]
});

  module.exports = mongoose.model("Category",categorySchema);