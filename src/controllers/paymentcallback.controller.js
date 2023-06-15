const {payment} = require('../models');
const helpers = require('../helpers/helpers');


const callback = async (req, res) => {
    let json = JSON.stringify(req.body);
    try {
    const signature = helpers.signatureCallback(json);
    console.log(signature);
    // data
    const data = await payment.update({
       where: {id: req.body.merchant_ref},
       is_paid: true,
    });
    return res.status(200).json({
            "success": true,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            "success": false,
        });
    }
}

module.exports = {
    callback
}