const {users} = require('../../models');
const validator = require('fastest-validator');
const bcrypt = require('bcrypt');
const {where} = require("sequelize");

const findAll = async (req, res) => {
    try {
        const user = await users.findAll();
        res.status(200).json({
            error : false,
            message: "success",
            data: user
        });
    } catch (err) {
        res.status(500).json({
            error : true,
            message: "error",
            data: err
        });
    }
};

const findById = async (req, res) =>{
    const idparam = req.params.id;
    console.log(idparam);
    try {
        const user = await users.findByPk(idparam);
        console.log(user);
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

const findByUsername = async (req, res) =>{
    const username = req.params.username;
    try {
        const user = await users.findOne({where: {username: username}});
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
    }catch (error) {
        res.status(500).json({
            error : true,
            message: "error",
            data: "internal server error"
        });
    }
};

const update = async (req, res) =>{
   const idParam = req.params.id;
    const data = req.body;

    // console.log(data);

    if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
    }

   const schema = {
        username: {type: "string", max: 250, optional: true},
        name   : {type: "string", max: 255, optional: true},
        email  : {type: "email", optional: true},
        password: {type: "string", min: 8, max: 255, optional: true},
    }
    const v = new validator();
    const validate = v.validate(data, schema);
    if (validate.length) {
        return res.status(400).json({
            error : true,
            message: "error",
            data: validate
        });
    }

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
            updated_at: new Date()
        };
        console.log("ini adalah updated",updated);

        await users.update(updated, {where: {id: idParam}});
        res.status(200).json({
            error : false,
            message: "success",
            data: updated
        });
    }catch (error) {
        res.status(500).json({
            error : true,
            message: "error",
            data: "internal server error"
        });
    }
}

module.exports = {
    findAll,
    findById,
    findByUsername,
    update
}
