const {users} = require('../../models');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('fastest-validator');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;


const userLogin = async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password
    };
    const schema = {
        email: {type: "email", optional: false},
        password: {type: "string", min: 8, max: 255, optional: false},
    }
    const v = new validator();
    const validate = v.validate(data, schema);
    if (validate.length) {
        return res.status(400).json({
            message: "error",
            data: validate
        });
    }
    try {
        const user = await users.findOne({where: {email: data.email}});
        if (!user) {
            return res.status(400).json({
                message: "error",
                data: "email or password is wrong"
            });
        }
        const validPassword = await bycrypt.compare(data.password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                message: "error",
                data: "email or password is wrong"
            });
        }
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            username : user.username,
        },jwtSecret, {expiresIn: '30h'});
        res.status(200).json({
            message: "success",
            data: {
                token : token
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "error",
            data: err
        });
    }
}

module.exports = {
    userLogin
}
