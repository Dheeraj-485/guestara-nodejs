const Category = require("../models/Category");
const subCategory = require("../models/subCategory");


//Middleware to check if category exists or not
exports.validateCategoryExists = async (req, res, next) => {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
    }
    next();
};


//Middleware to check if sub category exists or not
 exports.validatesubCategoryExists = async (req, res, next) => {
    const { subCategoryId } = req.params;
    const subCategories = await subCategory.findById(subCategoryId);
    if (!subCategories) {
        return res.status(404).json({ success: false, message: 'subCategory not found' });
    }
    next();
};
// module.exports={validateCategoryExists,validatesubCategoryExists}
