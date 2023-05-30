const {users} = require('../../models');

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

const findById = (req, res) =>{
    const id = req.params;
    try {
        const user = users.find((users) => users.id == id);
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
        res.status(500).json({
            error : true,
            message: "error",
            data: "internal server error"
        });
    }
};

const fimdByUsername = (req, res) =>{
    const username = req.params.username;
    try {
        const user = users.find((user) => user.username == username);
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

module.exports = {
    findAll,
    findById
}
