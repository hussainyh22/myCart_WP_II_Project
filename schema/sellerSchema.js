const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
    {
        seller_name:{
            type:String,
            required:true
        },
        seller_pass:String,
        seller_email:String,
        seller_mobile:String,
        seller_address:String
    }
)

module.exports = mongoose.model("seller",sellerSchema)