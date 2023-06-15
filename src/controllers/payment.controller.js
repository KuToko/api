const {payments, payment_methods} = require('../models');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const helpers = require('../helpers/helpers');
const moment = require('moment');
const validator = require('fastest-validator');
const axios = require("axios");


const store = async (req, res) => {
    const data = req.body;

    const schema = {
        payment_method_id: {type: "string", optional: false, min: 36},
        business_id: {type: "string", optional: false, min: 36},
        amount: {type: "number", optional: false},
    }

    // const {payment_method_id} = req.body;
    // const payment_method = await payment_methods.findOne({
    //     where: {
    //         id: payment_method_id
    //     }
    // });

    // if (!payment_method) {
    //     return res.status(400).json({
    //         message: "Payment method not found"
    //     });
    // }
    try {
        const dataSignatur = {
            merchant_ref: uuid.v4(),
            amount: data.amount,
        }
        console.log(JSON.stringify(dataSignatur));
        const signature = helpers.signature_transaksi(JSON.stringify(dataSignatur));
        if (!signature) {
            return res.status(400).json({
                message: "Signature not valid"
            });
        }

        const expiry = parseInt(Math.floor(new Date()/1000) + (24*60*60)); //24 jam
        const pay = {
           method: data.payment_method_id,
           merchant_ref: dataSignatur.merchant_ref,
            amount: dataSignatur.amount,
            user_id: helpers.getUserId(req),
            expired_time: expiry,
            signature: signature
        }
        const payload = JSON.stringify(pay);

        axios.post('https://tripay.co.id/api/transaction/create', payload, {
            headers: {
                'Authorization': 'Bearer ' + process.env.TRIPAY_API_KEY,
            },validateStatus: function (status) {
                return status < 999; //ignore status code
            }
        }).then(async (response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
        });
    }catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(payment_method.key, salt);
    const payment = await payments.create(

    );
    return res.status(200).json({
        message: "Payment created successfully",
        data: payment
    });
}

module.exports = {
    store
}