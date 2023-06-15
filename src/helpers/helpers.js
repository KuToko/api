const jwt = require('jsonwebtoken');
const crypto = require("crypto");
require('dotenv').config();
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

const signatureCallback = (json) =>
{
  const privateKey = process.env.TRIPAY_API_KEY;
  return crypto.createHmac("sha256", privateKey)
      .update(json)
      .digest('hex');
}

const signature_transaksi = async (merchant_ref, amount) => {
    const privateKey = process.env.PRIVATE_KEY;
    const merchant_code = process.env.MERCHANT_CODE;
    return crypto.createHmac("sha256", privateKey)
        .update(merchant_code + merchant_ref + amount)
        .digest("hex");
}

module.exports = {
  getUserId,
  signatureCallback,
  signature_transaksi
};
