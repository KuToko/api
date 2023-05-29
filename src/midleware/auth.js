const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
require('dotenv').config();

const auth = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (bearerHeader) {
    const bearerToken = bearerHeader.split(" ")[1];
    jwt.verify(bearerToken, jwtSecret, (err, data) => {
      if (err) {
        return res.status(403).json({
          error : true,
          message: "error",
          data: "forbidden"
        });
      }
      req.userData = data;
       next();
    });
  }else {
    res.status(401).json({
        error : true,
        message: "error",
        data: "unauthorized"
    });
};
}

module.exports = {
    auth: auth
}
