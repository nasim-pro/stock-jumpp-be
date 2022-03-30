const express = require('express');
const categoryRouter = express.Router();
const controller = require('../controller/categoryController')

categoryRouter.post('/addcategory', controller.addCategory);

categoryRouter.get('/getallcategory', controller.getallCategory)

categoryRouter.get('/getcategorybyid', controller.getCategoryById)

categoryRouter.delete('/deletecategory/:categoryid', controller.deleteCategory);

categoryRouter.get('/createCategory', controller.createCategoryForm)

module.exports = categoryRouter;