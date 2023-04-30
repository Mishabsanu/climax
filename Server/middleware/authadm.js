const { Admin } = require("../models/admin");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const verifyToken =  async (req, res, next) => {
  try {
    
    let token = req.header("Authorization");
    
    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trimLeft();
    }
    const verified = jwt.verify(token, process.env.JWTPRIVATEKEYADMIN);
    req.admin = verified;
    console.log(token,'tock');
    console.log(verified,'nnnnn');
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


module.exports = verifyToken;
