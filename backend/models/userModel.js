const mongoose=require('mongoose')

const userModel=mongoose.Schema(
    {
        firstname:{type:String,required:true},
        lastname:{type:String,required:true},
        email:{type:String, required:true, unique:true},
        uuid:{type:String, required:true, unique:true},
        password:{type:String, minlength:5, required:true},
        role:{type:String,required:true},
        contact:{type:String,required:false},
        location:{type:String,required:false},
        gender:{type:String,required:false},
        age:{type:Number,required:false},
        pic:
        {
            type:String,
            default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        },
    },
    {timestamps:true,}
);

const User=mongoose.model("User",userModel);

module.exports=User;

