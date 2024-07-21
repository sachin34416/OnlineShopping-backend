const mongoose = require('mongoose');

const OrdersSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter Customer Name"],


        },
        phone:{
            type:Number,
            required: [true, "Please Enter Phone Number"],
            
        },
        email:{
            type:String,
            required: [true, "Please Enter Your Email"],
        },
        shoe_name: {
            type: String,
            required: [true, "Please Enter Product Name"],


        },
        price:{
            type: Number,
            required: true,
            default: 0            
        },

    },
    {
        timestamps: true
    }
);
const Orders=mongoose.model("Orders",OrdersSchema);
module.exports=Orders;