const mongoose = require('mongoose');
const validator = require('validator');


const userOtpSchema = new mongoose.Schema({

    email: { 
		type: String, 
		required: true ,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Not Valid Email")
            }
        }
	},

    otp:{
        type:String,
        required:true,
    }

})

const userotp = new mongoose.model("userotp",userOtpSchema)

module.exports = userotp
