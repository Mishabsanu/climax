const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const { number } = require("joi");
const paginate = require( 'mongoose-paginate-v2');
const theaterSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true },
    application: { type: Object },
    screen: { type: Array},
    isBlocked: { type: Boolean },
    isApproved: { type: Boolean },
    isRejected: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

theaterSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEYTHEATER, {
    expiresIn: "7d",
  });
  return token;
};
theaterSchema.plugin(paginate);
const Theater = mongoose.model("theater", theaterSchema);

const validate = (data) => {
  console.log(data);
  const schema = Joi.object({
    Name: Joi.string().required().label("Theater Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    phone: Joi.number().required().label("Phone"),
  });
  return schema.validate(data);
};

module.exports = { Theater, validate };
