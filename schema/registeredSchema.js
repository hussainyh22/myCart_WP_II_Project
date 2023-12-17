const mongoose = require("mongoose");

const registeredSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        
    }
)

module.exports = mongoose.model("login",registeredSchema)