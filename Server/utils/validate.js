var Joi = require("joi");

var Loginvalidate = function(data) {
  var schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = Loginvalidate;
