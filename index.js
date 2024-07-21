const express = require('express')
const mongoose=require('mongoose');
const Product = require('./models/product.model.js');
const Customer = require('./models/customer.model.js');
const Orders = require('./models/order.model.js');
const Fuse = require('fuse.js');
const bcrypt = require('bcrypt');


const app = express();
app.use(express.json());


app.listen(3000,()=>{
    console.log("Server running on port 3000");
});
app.get('/api/products',async(req,res)=>{
    const arrOfPrdts = await Product.find({});
    res.status(200).json(arrOfPrdts);
});

app.get('/api/product/:id',async(req,res)=>{
    const {id} =req.params;

    const array=await Product.findById(id);
    res.status(200).json(array);
});

app.post('/api/products',async(req,res)=>{
    try{
        const product=await Product.create(req.body);
        res.status(200).json(product);
    }
    catch(error){
            res.status(500).json({message:error.message});
    }
});

app.post('/api/customers',async(req,res)=>{
    try{
        const cust=await Customer.create(req.body);
        res.status(200).json(cust);
    }
    catch(error){
            res.status(500).json({message:error.message});
    }
});

app.post('/api/customer/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email and password fields
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // Find the customer by email
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Return true if credentials are valid
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.put("/api/product/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        const arr=await Product.findByIdAndUpdate(id,req.body);
        
        if(!arr){
            return res.status(404).json({message:"Product not Found"});
        }
        const updat=await Product.findById(id);
        res.status(200).json(updat);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
});

app.delete("/api/product/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        const arr=await Product.findByIdAndDelete(id);
        res.status(200).json({message:"Deleted Succesfully"});
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
});


app.get('/api/products/search/:input', async (req, res) => {
    const { input } = req.params;

    try {


        // Retrieve all products
        const products = await Product.find();

        // Setup Fuse.js for fuzzy search
        const options = {
            includeScore: true,
            keys: ['name']
        };
        const fuse = new Fuse(products, options);

        // Perform the search
        const result = fuse.search(input);

        // Extract the actual product data from the result
        const matchedProducts = result.map(res => res.item);

        res.status(200).json(matchedProducts);
    } catch (error) {
        console.error('Error searching for products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


mongoose.connect("mongodb+srv://sachinrangabaskar344:abcd@backend.4d6ywoo.mongodb.net/?retryWrites=true&w=majority&appName=backend")
  .then(() => console.log('Connected!'))
.catch(()=>{
    console.log("Connection Failed");
});