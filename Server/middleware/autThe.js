const { Theater } = require("../models/Theater");
const jwt = require("jsonwebtoken");

const verifyToken =  async (req, res, next) => {
  try {
    
    let token = req.header("Authorization");
    
    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trimLeft();
    }
    const verified = jwt.verify(token, process.env.JWTPRIVATEKEYTHEATER);
    req.theater = verified;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


module.exports = verifyToken;