const {users} = require('../models');
const validator = require('fastest-validator');
const helper = require('../helpers/helpers')
const bcrypt = require('bcrypt');
const moment = require("moment");

const detail = async (req, res) =>{
   const idparam = helper.getUserId(req);
    try {
        const user = await users.findOne({where: {id: idparam}})
        if (!user) {
            return res.status(400).json({
                error : true,
                message: "error",
                data: "user not found"
            });
        }
        res.status(200).json({
            error : false,
            message: "success",
            data: user
        });
    }catch (err) {
        console.log(err)
        res.status(500).json({
            error : true,
            message: "error",
            data: err
        });
    }
};

const update = async (req, res) =>{
    const data = req.body;

    let schema ={};
    if (!data){
        schema = {
            username: {type: "string", max: 250, optional: false},
            name   : {type: "string", max: 255, optional: false},
            email  : {type: "email", optional: false},
        }
    }else {
        schema = {
            username: {type: "string", max: 250, optional: false},
            name   : {type: "string", max: 255, optional: false},
            email  : {type: "email", optional: false},
            password: {type: "string", min: 8, optional: false},
        }
    }

    const v = new validator();
    const validate = v.validate(data, schema);
    if (validate) {
        return res.status(400).json({
            error : true,
            message: "error",
            data: validate
        });
    }

    if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
    }

    const idParam = helper.getUserId(req);
    try {
        const user = await users.findByPk(idParam);
        if (!user) {
            return res.status(400).json({
                error : true,
                message: "error",
                data: "user not found"
            });
        }

        const emailExist = await users.findOne({where: {email: data.email}});
        if (emailExist) {
            return res.status(400).json({
                error : true,
                message: "error",
                data: "email already exist"
            });
        }

        const updated = {
            ...data,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        };
        const id = helper.getUserId(req)
        await users.update(updated, {where: {id: id}});
        res.status(200).json({
            error : false,
            message: "success",
            data: updated
        });
    }catch (error) {
        console.log(error)
        res.status(500).json({
            error : true,
            message: "error",
            data: "internal server error"
        });
    }
}

module.exports = {
    detail,
    update
}
