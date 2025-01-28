const mongoose=require("mongoose")
const categorySchema=new mongoose.Schema({
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
    taxApplicability:{
        type:Boolean,
        default:false
    },
    tax:{
        type:Number,
    default:null
    },
    taxType:{
        type:String,
        enum:["inclusive","exclusive"],
        default:"inclusive"
    },

})
const Category = new mongoose.model("Category",categorySchema)

module.exports=Category;