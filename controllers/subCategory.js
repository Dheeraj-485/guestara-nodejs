const subCategory = require("../models/subCategory");
const Category=require("../models/Category");
const { uploadToCloudinary } = require("../config/cloudinaryConfig");


//create a new sub category under category
exports.createSubCategory=async(req,res)=>{
    try {
        const {categoryId}=req.params; //extract category id from the url parameter
        const {name,description,taxApplicability,tax}=req.body;     //Extract fields from req.body
        let {image}=req.files; //extract image if provided
        const category=await Category.findById(categoryId); //check if category exists
        console.log(category.name);
        
        if(!category){
            return res.status(404).json({message:"Category not found"})
        }

            // Validate required fields
        if (!name || !description) {
            return res.status(400).json({
                message: "Name and description are required fields."
            });
        }

          //Image validation checked
          
     const allowedFormats=["image/png","image/jpeg","image/jpg","image/webp"];
     if(!allowedFormats.includes(image.mimetype)) {
        return res.status(400).json({message:"Invalid image format"})
     }

       try {
    

        if(req.files){
            const result=await uploadToCloudinary.uploader.upload(req.files.image.tempFilePath,{
                folder:"menu"
            })
            image=result.secure_url
        }
    } catch (error) {
        console.error("Error uploding to cloudinary",error.message)
        return res.status(500).json({message:"Error uploding to cloudinary",error:error.message})
    }
    

       const newSubCategory=new subCategory({
        name,
        image,
        description,
        taxApplicability:taxApplicability !==undefined ?taxApplicability :category.taxApplicability,
        tax:tax !==undefined ?tax :category.tax,
       categoryId
       })
       await newSubCategory.save()
       res.status(201).json({message:"SubCategory created successfully",subCategory:newSubCategory})

    } catch (error) {
        console.error("Error creating subCategory",error.message);
        res.status(500).json({message:"Error creating subCategory",error:error.message})
    }
}

//get all subCategory
exports.getAllSubCategories=async(req,res)=>{
    try {
        
    const getAll=await subCategory.find();
    return res.status(200).json({message:"Fetched all sub categories",getAll})


    } catch (error) {
      console.error("Error finding all sub categories",error.message)  
      res.status(500).json({message:"Error finding all sub categories",error:error.message})
    }
}

//get a single sub category
exports.getSubCategoryByCategory=async(req,res)=>{
    try {
        
const {categoryId}=req.params;
const category=await Category.findById(categoryId);
if(!category){
    res.status(404).json({message:"Category not found"})
}

const subCategories=await subCategory.find({categoryId});
res.status(200).json({message:"Sub categories found by categoryId",subCategories:subCategories})

    } catch (error) {
        res.status(500).json({message:"Error finding sub categories by categoryId",error:error.message})
        
    }
}

//get subcategory by id
exports.getSubCategoryById=async(req,res)=>{
    try {
        
 const {subCategoryId}=req.params;
 const subs=await subCategory.findById(subCategoryId);
 if(!subs){
   return res.status(404).json({message:"SubCategory not found"})
 }

 res.status(200).json({message:"Sub category found",doc:subs})


    } catch (error) {
      console.error("Error finding sub category",error.message)  
      res.status(500).json({message:"Error finding sub category",error:error.message})
    }
}


//update sub category
exports.editSubCategory=async(req,res)=>{
    try {
        
     const {subCategoryId}=req.params;
     const updates=req.body;

     if(req.files){
        const result=await uploadToCloudinary.uploader.upload(req.files.path);
        updates.image=result.secure_url;
     }

     const updateSubCategory=await subCategory.findByIdAndUpdate(subCategoryId,updates,{new:true,runValidators:true});

     if(!updateSubCategory){
        res.status(404).json({message:"Sub Category not found"})
     }

     res.status(200).json({message:"Sub Category updated successfully",updateSubCategory:updateSubCategory})
    } catch (error) {
     console.error("Error updating sub category",error.message)   
     res.status(500).json({message:"Error updating sub category",error:error.message})
    }
}