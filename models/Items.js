const mongoose=require("mongoose");
const subCategory = require("./subCategory");
const itemSchema=new mongoose.Schema({
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
        required:true,
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    subCategoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"subCategory"
    },
    taxApplicabitity:{
        type:Boolean,
        default:false
    },
    tax:{
        type:Number,
        default:0,
    },
    baseAmount:{
        type:Number,
        // default:100
        required:true
    },
    Discount:{
        type:Number,
        default:0
    },
    totalAmount:{
        type:Number,
        required:true
        // default:(baseAmount-Discount)
    }

})
const Item=new mongoose.model("Items",itemSchema);
module.exports=Item;