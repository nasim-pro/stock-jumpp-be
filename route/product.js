const express = require('express');
const productRouter = express.Router();
const controller = require('../controller/productController')

productRouter.post('/addproduct', controller.addProduct);

productRouter.put('/changeprice/:productid', controller.changePrice);

productRouter.get('/getallproduct', controller.getallProduct)

productRouter.delete('/deleteproduct/:productid', controller.deleteproduct);

productRouter.get('/createProduct', controller.createProduct)

module.exports = productRouter;