const jwt = require('jsonwebtoken');

const getUserId = (req) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return decoded.id;
  } catch (error) {
    console.log(error);
    throw new Error('Invalid token');
  }
};

module.exports = {
  getUserId,
};
