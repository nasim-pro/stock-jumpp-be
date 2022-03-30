const Category= require('../model/Category')
const mongoose = require('mongoose')
//adding category
exports.addCategory = async (req, res) => {
    const { name, categoryId } = req.body;
    let category= new Category({
        name: name,
        categoryId: categoryId
    });
    
         category.save((err) => {
            if (err) {
                return res.status(500).send({success: false, msg: err})
            } else {
                return res.status(200).send({success: true, msg: "Category added successfully"})
            }
        })
}

//getting all available category
exports.getallCategory = async (req, res) => {
    let products;
    try {
         products = await Category.find({ });
    } catch (error) {
        return res.status(500).send({ success: false, msg: err })
    }  
    return res.status(200).send(products)
}

//deleing a scategory from th database
exports.deleteCategory = async (req, res) => {
    let pid = mongoose.Types.ObjectId(req.params.productid);
    await Category.deleteOne({ _id: pid }, (err) => {
        if (err) {
            return res.status(500).send({ success: false, msg: err })
        }
    })
    return res.status(200).send({success: true, msg:"deleted successfully"})
}
//get the Object id of the particular category using id
exports.getCategoryById = async (req, res) => {
    let category;
    let categoryId = mongoose.Types.ObjectId(req.params.categoryId)
    try {
         category = await Category.find({ categoryId: categoryId })
    } catch (err) {
        return res.status(400).send({success: false, msg: err})
    }
    
    return res.status(200).send({success: true, category})
} 


exports.createCategoryForm = (req, res) => {
    res.render('createCategory.ejs')
}
