const mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
    name: {
        type :String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref :'Category'
    }],
    productId: {
        type: Number,
        required: true,
        unique: true
    }
})

let Product = mongoose.model("Product", productSchema);
module.exports = Product;