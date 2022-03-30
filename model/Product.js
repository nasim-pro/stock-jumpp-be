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
    category: {
        type:String,
        enum: ['pizza', 'burger', 'sweets', 'paratha', 'sandwich']
    },
    options: {
        type: String,
    }

})

let Product = mongoose.model("Product", productSchema);
module.exports = Product;