const mongoose=require("mongoose")
const subCategorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        // required:true
        default:"https://tse3.mm.bing.net/th?id=OIP.9nl2eFOD4SKNC_FIn0bSqQHaFj&w=355&h=355&c=7"
    },
    description:{
        type:String,
        required:true
    },
    categoryId:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"Category"
    },
    taxApplicability:{
        type:Boolean,
        default:false
    },
    tax:{
        type:Number,
    default:0
    }
})
const subCategory = new mongoose.model("subCategory",subCategorySchema)

module.exports=subCategory;