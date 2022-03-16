const Product = require('../model/Product')
const mongoose = require('mongoose')
exports.addProduct = (req, res) => {
    const { name, price, category } = req.body;
    let product = new Product({
        name: name,
        price: price,
        category: category
    });

    product.save((err) => {
        if (err) {
            return res.status(500).send({success: false, msg: err})
        }
    })
    return res.status(200).send({success: true, msg: "product added successfully"})
}

exports.getallProduct = (req, res) => {
    let products = Product.find({}, (err) => {
        if (err) {
            return res.status(500).send({ success: false, msg: err })
        }
    });
    return res.status(200).send({success: true, products})
}

exports.changePrice = (req, res) => {
    let pid = mongoose.Types.ObjectId(req.params.productid);
    let newprice = req.body.newprice;
    Product.updateOne({ _id: pid }, { price: newprice }, (err) => {
        if (err) {
            return res.status(500).send({ success: false, msg: err })
        }
    });
    return res.status(200).send({success: true, msg: "price updated successfully"})
    
}

exports.deleteproduct = (req, res) => {
    let pid = mongoose.Types.ObjectId(req.params.productid);
    Product.deleteOne({ _id: pid }, (err) => {
        if (err) {
            return res.status(500).send({ success: false, msg: err })
        }
    })
    return res.status(200).send({success: true, msg:"deleted successfully"})
}



