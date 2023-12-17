const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
    {
        product_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "product",
        }

    }
)
// product_img: [{
//     data: { type: Buffer },
//     contentType: { type: String },
//     fileName: { type: String }
//   }],

module.exports = mongoose.model("cart", CartSchema)