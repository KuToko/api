const {users} = require('../models');

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

}
module.exports = {
    findAll
}
