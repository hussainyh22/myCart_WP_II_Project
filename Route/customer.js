const express = require("express")
const fs = require("fs");
const { req } = require("http");
const router = express.Router();
const customer = require("../schema/customerSchema")
const Cart = require("../schema/cartSchema")
const product = require("../schema/productSchema")
const Order = require("../schema/orderSchema")


router.get('/custLogin_page', (req, res) => {
    res.render('custLogin/custLogin.ejs');
})

router.post('/custLogin', async (req, response) => {
    try{
    var username = req.fields.username;
    var password = req.fields.password;
    req.session.profile_name = "";
    //console.log(req.session.profile_name);
    var data = await customer.find();
    var custLogin = 0;
    // console.log("Registered Users are :", data);
    data.map((v) => {
        if (v.cust_email === username && v.cust_pass === password) {
            req.session.profile_name = username;
            req.session.password=password;
            custLogin = 1;
        }
    })
    if(req.session.url==undefined)
    {
        req.session.url="/customer/products";
    }

    response.json({ custLogin: custLogin, url: req.session.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }

})

router.post("/register", async (req, res) => {
    try {
        var data = customer.create({
            cust_name: req.fields.name,
            cust_email: req.fields.email,
            cust_pass: req.fields.password,
            cust_mobile: req.fields.mobile,
            cust_address: req.fields.address

        })

        // console.log("meg", data);
        res.json({ "msg": "ok" });
    } catch (e) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        // console.log(e.message);
    }

    // console.log(data);
})

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            res.status(500).json({ message: "Error destroying session" });
        } else {
            res.json({ url: "/customer/custLogin_page" }); // Redirect to the custLogin page or any other routerropriate action after logout.
        }
    });

})


router.post("/order", async (req, res) => {
    try{
    var cartData = await Cart.find();
    var product_ids=[];
    cartData.map((v)=>{
        product_ids.push(v.product_id.toString());
    })
    console.log("product_id",product_ids);
    // console.log(cartData);
    var dd=new Date();
    var day=dd.getDate();
    var month=dd.getMonth();
    var year=dd.getFullYear();
    // console.log("final price is",req.fields.finailPrice);
    if (cartData.length != 0) {
        var putOrderData = await Order.create({
            product_ids: product_ids,
            order_date:`${day}/${month}/${year}`,
            total:req.fields.finalPrice,
            quantity:req.fields.quantity
        })
        console.log("ordered data is ", putOrderData);
        var clearCartData = await Cart.deleteMany({});
        res.sendStatus(200);
    }
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }


})




router.get("/products", async (req, res) => {
    req.session.url = "/customer/products";
    var data = await product.find();
    var length = await Cart.find();
    if (req.session.profile_name != undefined || req.session.profile_name != null | req.session.profile_name == "") {
        res.render("customer/product_page.ejs", { data: data, length: length.length, profile_name: req.session.profile_name });
    }
    else {
        res.render("custLogin/custLogin.ejs");
    }
})

router.get("/myaccount", async (req, res) => {
    req.session.url = "/customer/myaccount";
    var data = await product.find();
    var custData = await customer.findOne({cust_email:req.session.profile_name,cust_pass:req.session.password});
    // console.log("custData is ",custData);
    var length = await Cart.find();
    var orderData= await Order.find();
    
    if (req.session.profile_name != undefined || req.session.profile_name != null | req.session.profile_name == "") {
        res.render("customer/myAccount.ejs", { data: data, length: length.length, profile_name: custData.cust_name,orderData:orderData,address:custData.cust_address,name:custData.cust_name,email:custData.cust_email,mobile:custData.cust_mobile,password:custData.cust_pass });
    }
    else {
        res.render("custLogin/custLogin.ejs");
    }
    
})

router.post("/getOrderDetail",async(req,res)=>{
    try{
    req.session.url = "/customer/getOrderDetail";
    req.session.id=req.fields.id;
    // console.log("id is =>",id);
    // var data = await product.find();
    // var custData = await customer.findOne({cust_email:req.session.profile_name,cust_pass:req.session.password});
    // // console.log("custData is ",custData);
    // var length = await Cart.find();
    var orderData=await Order.find({_id:req.session.id}).populate("product_ids");
     console.log("products are =>",orderData[0]);
    //var orderData= await Order.find();
        res.json({"msg":"ok"});
    //if (req.session.profile_name != undefined || req.session.profile_name != null | req.session.profile_name == "") {
    //     res.render("customer/orderProductDetail.ejs",{ data: data, length: length.length, profile_name: custData.cust_name });
    // }
    // else {
    //     res.render("custLogin/custLogin.ejs");
    // }
}catch(e){
    console.log("Error Messageee is =>",e.message);
}
})

router.get("/getOrderDetailPage",async(req,res)=>{
    var id=req.session.id;
    var data = await product.find();
    var custData = await customer.findOne({cust_email:req.session.profile_name,cust_pass:req.session.password});
    // console.log("custData is ",custData);
    var length = await Cart.find();
    var orderData=await Order.find({_id:id}).populate("product_ids");
     console.log("products are =>",orderData[0].product_ids);
    res.render("customer/orderProductDetail.ejs",{ data: data, length: length.length,profile_name:"Galina" });
})

router.get("/cart", async (req, res) => {
    req.session.url = "/customer/cart";
    var data = await Cart.find().populate("product_id");
    // console.log(data);
    if (req.session.profile_name != undefined || req.session.profile_name != null | req.session.profile_name == "") {
        res.render("customer/cart.ejs", { data: data, length: data.length, profile_name: req.session.profile_name });
    }
    else {
        res.render("custLogin/custLogin.ejs");
    }

})

router.post("/updateAddress",async(req,res)=>{
    var custData = await customer.findOne({cust_email:req.session.profile_name,cust_pass:req.session.password});
    var newAddress=req.fields.newAddress;
    custData.cust_address=newAddress;
    await custData.save();
    res.json("Update succesful");
})

router.post("/updateDetails",async(req,res)=>{
    try{
    var custData = await customer.findOne({cust_email:req.session.profile_name,cust_pass:req.session.password});
    var name=req.fields.name;
    // var email=req.fields.email;
    // var password=req.fields.password;
    var mobile=req.fields.mobile;

    if(name!=null || name!=undefined || name!="")
    {
        custData.cust_name=name;
    }
    else
    {
        custData.cust_name=custData.cust_name;
    }
    //--------------- err code below------------------------
    // if(email!=null || email!=undefined || email!="")
    // {
    //     custData.cust_email=email;
    // }
    // else
    // {
    //     custData.cust_email=custData.cust_email;
    // }
    // if(password!=null || password!=undefined || password!="")
    // {
    //     custData.cust_pass=password;
    // }
    // else
    // {
    //     custData.cust_pass=custData.cust_pass;
    // }
    // -----------------------------------------------------
    if(mobile!=null || mobile!=undefined || mobile!="")
    {
        custData.cust_mobile=mobile;
    }
    else
    {
        custData.cust_mobile=custData.cust_mobile;
    }
    await custData.save();
    res.json("Update succesful");
    }catch(e){
         // console.log("messaage",e.message);
    }
})


router.post("/deleteCust",async(req,res)=>{
    var email=req.session.username;
    var password=req.session.password;

    var data=await customer.deleteOne({cust_email:email,cust_pass:password});
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            res.status(500).json({ message: "Error destroying session" });
        } else {
            // Session is successfully destroyed.
            res.json({ message: "Session destroyed" });
        }
    });
    res.json({logout:1});
})

router.get("/contact_us", async (req, res) => {
    req.session.url = "/customer/contact_us";
    var data = await Cart.find().populate("product_id");
    if (req.session.profile_name != undefined || req.session.profile_name != null | req.session.profile_name == "") {
        res.render("customer/contantUs.ejs", { data: data, length: data.length, profile_name: req.session.profile_name });
    }
    else {
        res.render("custLogin/custLogin.ejs");
    }

})

router.get("/about", async (req, res) => {
    req.session.url = "/customer/about";
    var length = await Cart.find();
    if (req.session.profile_name != undefined || req.session.profile_name != null | req.session.profile_name == "") {
        res.render("customer/aboutUs.ejs", { length: length.length, profile_name: req.session.profile_name });
    }
    else {
        res.render("custLogin/custLogin.ejs");
    }

})

router.get("/privacy_policy", async (req, res) => {
    req.session.url = "/customer/privacy_policy";
    var length = await Cart.find();
    if (req.session.profile_name != undefined || req.session.profile_name != null | req.session.profile_name == "") {
        res.render("customer/privacyPolicy.ejs", { length: length.length, profile_name: req.session.profile_name });
    }
    else {
        res.render("custLogin/custLogin.ejs");
    }

})

router.post("/deleteCartItem", async (req, res) => {
    var id = req.fields.id;
    var deleteItem = await Cart.deleteOne({ _id: id });
    // console.log(deleteItem);
})

router.post("/addToCart", async (req, res) => {
    try {
        var porductData = await product.find();
        var id = porductData[req.fields.indx]._id.toString();
        // console.log(id);
        var data = await Cart.create({
            product_id: id
        })
        // console.log(data);

    } catch (e) {
        // console.log(e.message);
    }
})

module.exports = router;