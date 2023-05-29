const {users} = require('../models');

const findAll = async (req, res) => {
    try {
        const user = await users.findAll();
        return res.status(200).json({
            message: "success",
            data: user
        });
    } catch (err) {
        return  res.status(500).json({
            message: "error",
            data: err
        });
    }

}
module.exports = {
    findAll
}
