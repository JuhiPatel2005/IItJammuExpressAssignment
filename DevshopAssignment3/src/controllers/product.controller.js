const Product = require("../models/product.model")

// Create a product POST
const createProduct = async (req, res, next) => {
    try{
        const product = await Product.create(req.body)
        res.status(201).json({
            success: true, data: product
        })
    } catch(error){
        next(error);
    }
}

// Get all products GET
const getProducts = async (req, res, next) => {
    try{
        const products = await Product.find();
        res.status(200).json({
            success: true, count: products.length, data: products
        })
    }catch{
        next(error)
    }
}

// Get a single product (GET)
const getProductById = async (req, res, next) => {
    try{
        const product = await Product.findById(req.params.id)
        if(!product){
            return res.status(404).json({
                success: false, message: "product not found"
            })
        }
        res.json({
            success: true, data: product
        })
    }catch(error){
        next(error)
    }
}

// Update a product PUT
const updateProduct = async (req, res, next) => {
    try{
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if(!product){
            return res.status(404).json({
                success: false, message: "product not found"
            })
        }

        res.json({
            success: true, data: product
        })

    } catch(error){
        next(error)
    }
}

// Delete the product (DELETE)
const deleteProduct = async (req, res, next) => {
    try{
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product){
            return res.status(404).json({
                success: false, message: "product not found"
            })
        }
        res.json({
            success: true, message: "Product deleted successfully"
        })
    }catch (error){
        next(error)
    }
}

module.exports = {createProduct, getProducts, getProductById, updateProduct, deleteProduct}