let {orders, order_details, payments, businesses, users, sequelize} = require('../models');
const DB = require('../config/knex');
const helpers = require('../helpers/helpers');
const uuid = require('uuid');
const moment = require('moment');
const validator = require('fastest-validator');
const axios = require("axios");

const store = async (req, res) => {
    const dataBody = req.body;

    const schema = {
        business_id: {type: "string", optional: false, min: 36},
        payment_id: {type: "string", optional: false, min: 36},
        status: {type: "string", optional: false},
        price: {type: "number", optional: false},
        total_price: {type: "number", optional: false},
        order_details:{type:"array", item:"string"}
    }

    const v = new validator();
    const validate = v.validate(dataBody, schema);
    if (validate.length) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validate
        });
    }

    const t = await sequelize.transaction();

    try {
        const cekBusiness = await businesses.findOne({
            where: {
                id: dataBody.business_id
            }
        });
        if (!cekBusiness) {
            return res.status(400).json({
                message: "Business not found"
            });
        }
        //
        // var expiry = parseInt(Math.floor(new Date()/1000) + (24*60*60));
        // const merchan_ref = uuid.v4();
        // const signatur = helpers.signature_transaksi(merchan_ref, dataBody.total_price);
        // const dataPayment = {
        //     id: uuid.v4(),
        //     user_id: helpers.getUserId(req),
        //     business_id: dataBody.business_id,
        //     amount : dataBody.total_price,
        //     order_details: dataBody.order_details,
        //     expired_time : expiry,
        //     signature   : signatur
        // }
        //
        // const payload = JSON.stringify(dataPayment);
        // axios.post('https://tripay.co.id/api/transaction/create', payload, {
        //     headers: {
        //         'Authorization': 'Bearer ' + process.env.TRIPAY_API_KEY,
        //     }, validateStatus: function (status) {
        //         return status < 999; //ignore status code
        //     }
        // }).then(async (response) => {
        //     console.log(response);
        //     if (response.status == 'success') {
        //         await payments.create({
        //             id:uuid.v4(),
        //             user_id: helpers.getUserId(req),
        //
        //         }, {transaction: t});
        //     }
        // })
        //     .catch((err) => {
        //         console.log(err);
        //     });
        //
        // const payment = {
        //     id: uuid.v4(),
        //     user_id: helpers.getUserId(req),
        //     payments_method_id: dataBody.paymentMethod,
        //     is_paid: false,
        //     merchant_ref: merchan_ref,
        // }
        const data = {
            id: uuid.v4(),
            user_id:helpers.getUserId(req),
            business_id: dataBody.business_id,
            payment_id: dataBody.payment_id,
            status: dataBody.status,
            price: dataBody.price,
            total_price: dataBody.total_price,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        };

        await orders.create(data, {transaction: t});

        let detailOrder = []
        for (let i = 0; i < detail.length; i++) {
            detailOrder.push({
                id: uuid.v4(),
                product_id: dataBody.order_details[i].product_id,
                order_id: data.id,
                quantity: dataBody.order_details[i].quantity,
                price: dataBody.order_details[i].price,
                total_price: dataBody.order_details[i].total_price,
            })
        }
        for (let i = 0; i < detailOrder.length; i++) {
            await order_details.create(detailOrder[i],{
                transaction: t
            })
        }
        await t.commit();
         return res.status(201).json({
             errors: false,
             message: "Order created successfully",
             data: {
                    order: data,
                    order_details: detailOrder
             }
         });
    }catch (err) {
        await t.rollback();
        console.log(err);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};

const list = async (req, res) => {
    try {
        const data = await orders.findAll(
            //{
        //     include:[ {
        //         model: order_details,
        //         required: true
        //     },
        //         {
        //             model: payments,
        //             required: true
        //         }
        //     ]
        // }
        );
        return res.status(200).json({
            errors : false,
            message: "List of all orders",
            data: data
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};

const detail = async (req, res) => {
    const {id} = req.params;
    try {
        const data = await orders.findOne({
            where: {
                id: id
            },
            include: [
                {
                    model: order_details,
                    required: true
                },
                {
                    model: payments,
                    required: true
                }
            ]
        });
        return res.status(200).json({
            errors : false,
            message: "Detail of order",
            data: data
        });
    }catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};

const destroy = async (req, res) => {
    const id = req.params.id;
    const schema = {
        id: {type: "string", optional: false, min: 36}
    }
    const v = new validator();
    const validate = v.validate({id: id}, schema);
    if (validate.length) {
        return res.status(400).json({
            message: "Validation failed",
            errors: "id not falid"
        });
    }

    try {
        const data = await orders.destroy({
            where: {
                id: id
            }
        });
        return res.status(200).json({
            errors : false,
            message: "Order deleted successfully",
            data: data
        });
    }catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

module.exports ={
    store,
    destroy,
    detail,
    list
}