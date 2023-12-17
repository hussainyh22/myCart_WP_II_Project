const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        product_name:{
            type:String,
            required:true
        },
        product_img:{
            type: Array
        },
        product_price:{
            type:String
        }
    }
)
// product_img: [{
        //     data: { type: Buffer },
        //     contentType: { type: String },
        //     fileName: { type: String }
        //   }],

module.exports = mongoose.model("product",productSchema)