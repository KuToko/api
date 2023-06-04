const {users} = require('../../models');
const {tokens} = require('../../models');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
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
        const cekToken = await tokens.findOne({where: {user_id: user.id}});
        if (cekToken) {
            await tokens.destroy({where: {user_id: user.id}});
        }
        const createtoken = jwt.sign({
            id: user.id,
            email: user.email,
            username : user.username,
        },jwtSecret);

        if (!createtoken) {
            return res.status(500).json({
                message: "error",
                data: "internal server error"
            });
        }
        await tokens.create({
            id: uuid.v4(),
            user_id: user.id,
            token: createtoken,
            created_at: new Date(),
            expired_at: Date.now() +(86400000*7),
            updated_at: new Date()
        });

        res.status(200).json({
            message: "success",
            data: {
                token : createtoken,
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "error",
            data: "internal server error"
        });
    }
}

module.exports = {
    userLogin
}
