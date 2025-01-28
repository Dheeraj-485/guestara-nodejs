const express=require('express');
const { createSubCategory, getAllSubCategories, getSubCategoryByCategory, getSubCategoryById, editSubCategory } = require('../controllers/subCategory');
const { validateCategoryExists, validatesubCategoryExists } = require('../config/middlewares');

const router=express.Router();

router.post("/categories/:categoryId/subCategory",validateCategoryExists,createSubCategory)
router.get("/subCategories",getAllSubCategories)
router.get("/categories/:categoryId/subCategories",validateCategoryExists,getSubCategoryByCategory);
router.get("/categories/:categoryId/subCategories/:subCategoryId",validateCategoryExists,validatesubCategoryExists,getSubCategoryById)
router.put("/subCategories/:subCategoryId",validatesubCategoryExists,editSubCategory)

module.exports=router;

