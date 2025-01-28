const express=require("express")
const bodyParser=require("body-parser");
const { mongoose } = require("mongoose");
const categoryRoutes=require("./routes/Category")
const subCategoryRoutes=require("./routes/subCategory")
const itemRoutes=require("./routes/Items")

const fileUpload=require("express-fileupload")
require("dotenv").config();

const app=express();
app.use(express.json());
// app.use(fileUpload())
app.use(
    fileUpload({
        useTempFiles: true, // Enables saving files temporarily
        tempFileDir: "/tmp/", // Directory for temporary files
    })
);

const port=process.env.PORT || 8080;
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>console.log("MongoDB connected")).catch((err)=>console.log("Error connecting to MongoDb",err.message)
)

app.use("/category",categoryRoutes)
app.use("/",subCategoryRoutes)
app.use("/",itemRoutes)

app.listen(port,()=>{
    console.log(`Server listening on port ${port}` );
    
})