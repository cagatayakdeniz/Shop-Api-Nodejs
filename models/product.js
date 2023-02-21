const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    text: String,
    username: String,
    date: {
        type: Date,
        default: Date.now
    },
    // user: { type: Schema.Types.ObjectId, ref: "User"}
});

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    imageUrl: String,
    date: {
        type: Date,
        default: Date.now
    },
    isActive: Boolean,
    category: {type: mongoose.Schema.Types.ObjectId, ref:'Category'},
    comments: [commentSchema]
});

const Product = mongoose.model("Product",productSchema);
const Comment = mongoose.model("Comment",commentSchema);

module.exports = { Product, Comment};