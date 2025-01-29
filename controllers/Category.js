const { uploadToCloudinary } = require("../config/cloudinaryConfig");
const Category = require("../models/Category");

const crypto=require("crypto")



//create a new category
exports.createCategory = async(req,res)=>{
    const {name,description,taxApplicability,taxType} = req.body
    let {tax}=req.body
    let  {image}=req.files;
          
    
    try {

        if(!name || !description || taxApplicability===undefined){
            return res.status(400).json({message:"Name, description, taxApplicability is mandatory"})
        }

        
        //Image validation checked
    //     if(req.files || !/^image\/(jpeg|png|jpg)$/.test(image.mimetype)){
    //  return res.status(400).json({message:"Only jpeg,png or jpg images are allowed"})
    //     }
    
        // console.log(req.files);
        
        // Assign a random tax number if not provided
        if (!tax) {
         tax = crypto.randomInt(100000000, 999999999).toString(); // Random 9-digit number
     }

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
    // const randomNo= crypto.randomBytes(10).length(9)

        const newCategory=new Category({
            name,
            description,
            taxApplicability,
            tax,
            taxType,
            image

        })
      const doc=  await newCategory.save();
      console.log("Created category:",doc);
      
     return res.status(201).json({message:"Successfully created category",doc})

    } catch (error) {
        console.error("Error Creating Category",error.message)
        res.status(500).json({message:"Error creating category",error:error.message})
    }
}


//fetch all categories
exports.getAllCategories=async(req,res)=>{
    try {

        //get all categories from the database and return it
         const findAll=await Category.find({});
         return res.status(200).json({message:"Successfully fetched all categories",findAll})


    } catch (error) {
        console.error("Error finding all categories",error.message);
        return res.status(500).json({message:" finding all categories",error:error.message});

    }
}


//get a single category
exports.getSingleCategory=async(req,res)=>{
    try {
        
      const {id}=req.params;
      const findDoc=await Category.find({_id:id})
      if(!findDoc){
        return res.status(404).json({message:"Category not found"})
      }

      return res.status(200).json({message:"Fetched a category",doc:findDoc})
    } catch (error) {
        console.error("Error finding a category",error.message);
        return res.status(500).json({message:"Error finding a category",error:error.message});
    }
}

// Update a category
exports.updateCategory=async(req,res)=>{
    try {

        const {id}=req.params;
        const findcategory=await Category.find({id});

        //check if category exists
        if(!findcategory){
            res.status(404).json({message:"Category not found ,please enter a valid category "})
            
        }
        const updates=req.body; // every thing that we want to update we can send it in form data

//update image if provided

        if(req.files){
            const result=await uploadToCloudinary.uploader.upload(req.files.image.tempFilePath,{ // if we added image in form data than proceed with it else not
                folder:"menu"
            })
            updates.image=result.secure_url; 
        }

          //update the category in the database
        const updateCategory=await Category.findByIdAndUpdate(id,{updates},{new:true});
        return res.status(200).json({message:"Updated category",updateCategory})
        
    } catch (error) {
        console.error("Error updating a category",error.message);
        return res.status(500).json({message:"Error  updating a category",error:error.message});
    }
        
    
}