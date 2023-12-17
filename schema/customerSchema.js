const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
        cust_name:{
            type:String,
            required:true
        },
        cust_email:String,
        cust_pass:String,
        cust_mobile:String,
        cust_address:String
    }
)

module.exports = mongoose.model("customer",customerSchema)