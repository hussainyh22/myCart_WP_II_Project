const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        product_ids:[ {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "product",
        }
    ],
    order_date:String,
    total:Number,
    quantity:[{
        type:Number
    }]

    }
)
// product_img: [{
//     data: { type: Buffer },
//     contentType: { type: String },
//     fileName: { type: String }
//   }],

module.exports = mongoose.model("order", orderSchema)