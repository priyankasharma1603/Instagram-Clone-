const mongoose=require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/priyankasharma/image/upload/v1727286735/lozdpcusgwrp4qbxh1qy.jpg"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]

})
mongoose.model("User",userSchema)