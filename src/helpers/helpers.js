const jwt = require('jsonwebtoken');
const DB = require('../config/knex');

const getUserId = (req) => {
  try {
    const token = req.headers.authorization.split(' ')[1];  
    const userId = DB('tokens').where({ token }).select('user_id').first();
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return userId;
  } catch (error) {
    console.log(error);
    throw new Error('Invalid token');
  }
};

module.exports = {
  getUserId,
};
