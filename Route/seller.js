const express = require("express")
const fs = require("fs");
const { request } = require("http");
const router = express.Router();
const session = require("express-session");
const seller= require("../schema/sellerSchema");

router.get("/seller_login",async(req,res)=>{
    res.render("sellerLogin/selllerLogin.ejs");
})



router.post("/register",async(req,res)=>{
    try{
    var data=seller.create({
        seller_name:req.fields.name,
        seller_email:req.fields.email,
        seller_pass:req.fields.password,
        seller_mobile:req.fields.mobile,
        seller_address:req.fields.address

    })

    console.log("meg",data);
    res.json({"msg":"ok"});
    }catch(e){
        console.log(e.message);
    }

    // console.log(data);
})


module.exports = router;