const express=require('express');
const { createCategory, getAllCategories, getSingleCategory, updateCategory} = require('../controllers/Category');
const router=express.Router();

router.post("/",createCategory).get("/",getAllCategories).get("/:id",getSingleCategory).patch("/:id",updateCategory)
module.exports=router;