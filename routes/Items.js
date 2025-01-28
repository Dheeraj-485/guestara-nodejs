const express=require("express");
const { createItem, getItemByIdOrName, getAllItems, getItemsBySubcategory, getItemsByCategory, editItem } = require("../controllers/Items");
const { validateCategoryExists, validatesubCategoryExists } = require("../config/middlewares");
const router=express.Router();


router.post('/categories/:categoryId/items',validateCategoryExists,createItem);
router.post('/categories/:categoryId/subcategories/:subCategoryId/items',validateCategoryExists,validatesubCategoryExists, createItem);
router.get('/getAllItems', getAllItems);
router.get('/categories/:categoryId/items', validateCategoryExists,getItemsByCategory);
router.get('/categories/:categoryId/subcategories/:subCategoryId/items',validatesubCategoryExists, validatesubCategoryExists,getItemsBySubcategory);
router.get('/items/:itemId', getItemByIdOrName); // Fetch by ID
router.get('/items', getItemByIdOrName); // Fetch by name

router.put('/items/:itemId',editItem);
module.exports=router;


