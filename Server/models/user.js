const paginate = require( 'mongoose-paginate-v2');
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const userSchema = new mongoose.Schema({
	username: { type: String, required: true },
	phone: { type: String, required: false },
	place: { type: String, required: false },
	city: { type: String, required: false },
	pincode: { type: String, required: false },
	imageUrl: { type: String, required: false },
	address: { type: String, required: false },
	email: { type: String, required: true },
	password: { type: String, required: true },
	Block:{type:Boolean,default:false}
	// verified: { type: Boolean, default: false },
});

userSchema.plugin(paginate);

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};

const User = mongoose.model("mizu", userSchema);

const validate = (data) => {
	const schema = Joi.object({
		username: Joi.string().required().label("User Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
	});
	return schema.validate(data);
};


module.exports = { User, validate };
