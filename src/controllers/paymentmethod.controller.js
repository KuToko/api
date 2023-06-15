const {paymentMethod} = require('../models');
const validation = require('fastest-validator');

const list = async (req, res) => {
    try {
        const payment_methods = await paymentMethod.findAll();
        return res.status(200).json({
            message: "success",
            data: payment_methods
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "error",
            data: err
        });
    }
}

const detail = async (req, res) => {
    const id = req.params.id;

    const schema = {
        id: {type: "string", optional: false, min: 36}
    }
    const v = new validation();
    const validator = v.validate(id, schema);

    if (validator.length) {
        return res.status(400).json({
            message: "error",
            data: "id not valid"
        });
    }

    try {

        const payment_method = await paymentMethod.findOne({
            where: {
                id: id
            }
        });
        if (!payment_method) {
            return res.status(400).json({
                message: "error",
                data: "payment method not found"
            });
        }
        return res.status(200).json({
            message: "success",
            data: payment_method
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "error",
            data: err
        });
    }
}


module.exports = {
    list,
    detail
}