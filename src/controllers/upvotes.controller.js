const {users, upvotes, businesses} = require("../models");
const validator = require("fastest-validator");
const uuid = require("uuid");
const helper = require('../helpers/helpers')
const moment = require("moment");
const DB = require('../config/knex');


const list=async (req, res) => {


    const page = req.query.page;
    const limit = 10;
    try {
        const idUser = helper.getUserId(req);
        
        const votes = await DB('upvotes')
        .where({user_id: idUser})
        .paginate({perPage: limit, currentPage: page});

        res.status(200).json({
            error: false,
            message: "success",
            data: votes.data,
            pagination: votes.pagination
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({
            error: true,
            message: "internal server error",
        });
    }
}

const detail = async (req, res) => {
    const param = req.params.id;
    const scema={
        param : {type: "string", min:36, max:36, optional: false}
    }
    const v = new validator();
    const validate = v.validate({param}, scema);
    if (validate.length) {
        return res.status(400).json({
            error: true,
            message: "error",
            data: "id not valid"
        });
    }

    try {
        const data = await upvotes.findByPk(param,{

            include:[ {
                model: businesses,
                attributes: ["name"],
                required: true
            },
                {
                    model: users,
                    attributes: ["username"],
                    required: true
                }
            ]
        });
        if (!data) {
            return res.status(404).json({
                error: true,
                message: "upvote not found",
                data: null
            });
        }

        res.status(200).json({
            error: false,
            message: "success",
            data: data
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({
            error: true,
            message: "internal server error",
        });
    }
}
const store = async (req, res) => {    
    const data={
            business_id: req.body.business_id,
    }
    const schema = {
        business_id: {type: "string", optional: false, min: "36", max: "36"}
    }
    const v = new validator();
    const validateRes = v.validate(data, schema);
    if (validateRes.length) {
        return res.status(400).json({
            error: true,
            message: "validation error",
            data: "business_id not valid"
        });
    }
    try {
        const {user_id} = await helper.getUserId(req);        
        const isVoted = await DB('upvotes').where({business_id: req.body.business_id, user_id: user_id});
        if (isVoted.length) {
            return res.status(400).json({
                error: true,
                message: "validation error",
                data: "you already voted"
            });
        }
        // const business = await businesses.findByPk(data.business_id);
        const business = await DB('businesses').where({id: data.business_id})
        if (!business) {
            return res.status(404).json({
                error: true,
                message: "business not found",
                data: null
            });
        }

        const created =  await DB('upvotes').insert({
            user_id: user_id,
            business_id: data.business_id,
            created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss")
        })
        res.status(200).json({
            error: false,
            message: "success",
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({
            error: true,
            message: "internal server error",
        });
    }
};

const destroy = async (req, res) => {
    const id = req.params.id;

    const schema = {
        id: {type: "string", optional: false, min: "36"},
    }
    const v = new validator();
    const validateRes = v.validate({id}, schema);
    if (validateRes.length) {
        return res.status(400).json({
            error: true,
            message: "validation error",
            data: "id not valid"
        });
    }
    try {
        const data = await upvotes.destroy({where: {id: id}});
        if (!data) {
            return res.status(404).json({
                error: true,
                message: "upvote not found",
                data: null
            });
        }
        res.status(200).json({
            error: false,
            message: "success",
            data: data
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({
            error: true,
            message: "internal server error",
        });
    }
}
module.exports ={
    list,
    detail,
    store,
    destroy
}
