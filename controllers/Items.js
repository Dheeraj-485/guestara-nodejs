const { uploadToCloudinary } = require("../config/cloudinaryConfig");
const Category = require("../models/Category");
const Item = require("../models/Items");
const subCategory = require("../models/subCategory");


exports.createItem = async (req, res) => {
    try {
        const { categoryId, subCategoryId } = req.params;
        const { name, description, taxApplicability, tax, baseAmount, discount } = req.body;
        let {image}=req.files;

        // Validate category or subcategory existence
        if (categoryId) {
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(404).json({  message: 'Category not found' });
            }
        }

        if (subCategoryId) {
            const subcategory = await subCategory.findById(subCategoryId);
            if (!subcategory) {
                return res.status(404).json({ message: 'Subcategory not found' });
            }
        }

        
        
     const allowedFormats=["image/png","image/jpeg","image/jpg","image/webp"];
     if(!allowedFormats.includes(image.mimetype)) {
        return res.status(400).json({message:"Invalid image format"})
     }
        if (req.files) {
            const result = await uploadToCloudinary.uploader.upload(req.files.image.tempFilePath,{
                folder:"menu"
            });
            image = result.secure_url;
        }

        const totalAmount = baseAmount - (discount || 0);

        const newItem = await Item.create({
            name,
            image,
            description,
            taxApplicability,
            tax,
            baseAmount,
            discount,
            totalAmount,
            categoryId,
            subCategoryId,
        });

        res.status(201).json({ message:"Item created successfully", item: newItem });
    } catch (error) {
        console.error("Error creating item", error.message);
        res.status(500).json({  message:"Error creating item", error: error.message });
    }
};



// exports.createItem = async (req, res) => {
//     try {
//         const { categoryId, subCategoryId } = req.params;
//         const { name, description, taxApplicability, tax, baseAmount, discount } = req.body;

//         // Validate categoryId and subcategoryId existence
//         const category = await Category.findById(categoryId);
//         if (!category) {
//             return res.status(404).json({ success: false, message: 'Category not found' });
//         }

//         let subCategories;
//         if (subCategoryId) {
//             subCategories = await subCategory.findById(subCategoryId);
//             if (!subCategories) {
//                 return res.status(404).json({ success: false, message: 'Subcategory not found' });
//             }
//         }

//         // Handle file upload
//         let image = '';
//         if (req.file) {
//             const result = await uploadToCloudinary.uploader.upload(req.file.path);
//             image = result.secure_url;
//         }

//         const totalAmount = baseAmount - (discount || 0);

//         // Create item with both categoryId and subcategoryId
//         const newItem = await Item.create({
//             name,
//             image,
//             description,
//             taxApplicability,
//             tax,
//             baseAmount,
//             discount,
//             totalAmount,
//             categoryId,
//             subCategoryId: subCategories ? subCategories._id : undefined,
//         });

//         res.status(201).json({ message: "Item created successfully", item: newItem });
//     } catch (error) {
//         console.error("Error creating item", error.message);
//         res.status(500).json({ message: "Error creating item", error: error.message });
//     }
// };


exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json({ message:"Fetched all items", items });
    } catch (error) {
        res.status(500).json({ message:"Error fetching all items",error: error.message });
    }
};


exports.getItemsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const items = await Item.find({ categoryId });
        res.status(200).json({ message:"Fetched items by using category id", items });
    } catch (error) {
        console.error("Error fetching items by category id",error.message)
        res.status(500).json({ message:"Error fetching items using category id", error:error.message });
    }
};



exports.getItemsBySubcategory = async (req, res) => {
    try {
        // const { categoryId } = req.params;
        const { subcategoryId } = req.params;


        const items = await Item.find( {subcategoryId} );
        res.status(200).json({ message:"Fetched items using sub category id", items });
    } catch (error) {
        console.error("Error fetching items using sub category id",error.message)
        res.status(500).json({ message:"Error fetching items using sub category id",error:error.message });
    }
};



exports.getItemByIdOrName = async (req, res) => {
    try {
        const { itemId } = req.params; // Fetch by ID
        const { name } = req.query; // Fetch by Name

        // Build the query dynamically based on presence of itemId or name
        const query = itemId
            ? { _id: itemId }
            : name
            ? { name: { $regex: name, $options: 'i' } } // Case-insensitive search
            : null;

        // If no query is provided, return an error
        if (!query) {
            return res.status(400).json({ message: 'Please provide an itemId or a name for search' });
        }

        // Find the item(s)
        const items = itemId
            ? await Item.findOne(query) // Fetch single item by ID
            : await Item.find(query); // Fetch items by Name

        if (!items || (Array.isArray(items) && items.length === 0)) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({
            message: 'Item found',
            items: Array.isArray(items) ? items : [items], // Return as an array if single item
        });
    } catch (error) {
        console.error('Error finding item:', error.message);
        res.status(500).json({ message: 'Error finding item', error: error.message });
    }
};

exports.editItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const updates = req.body;

        // Update image if a new one is uploaded
        if (req.files) {
            const result = await uploadToCloudinary.uploader.upload(req.files.tempFilePath,{
                folder:"menu"
            });
            updates.image = result.secure_url;
        }

        const updatedItem = await Item.findByIdAndUpdate(itemId, updates, { new: true, runValidators: true });
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ message:"Item updated successfully", item: updatedItem });
    } catch (error) {
        console.error("Error updating item",error.message)
        res.status(500).json({  message:"Error updating item" ,error:error.message });
    }
};



exports.searchItemsByName = async (req, res) => {
    try {
        const { name } = req.query;

        const items = await Item.find({
            name: { $regex: name, $options: 'i' },
        });

        res.status(200).json({ message:"Searched item by name", items });
    } catch (error) {
        console.error("Error searching by name",error.message)
        res.status(500).json({  message:"Error searching item by name",error:error.message });
    }
};
