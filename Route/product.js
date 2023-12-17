const express = require("express");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const product= require("../schema/productSchema");
// const formidable = require('express-formidable');

const route = express.Router();
// route.use(express.json());
route.use(express.urlencoded({extended:false})); 
var products_details = [];



module.exports = route;