const {tokens} = require('../../models');


const logout = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    try {
        const cekToken = await tokens.findOne({where: {token: token}});
        if (!cekToken) {
            return res.status(400).json({
                error : true,
                message: "error",
                data: "token not found"
            });
        }
        await tokens.destroy({where: {token: token}});
        res.status(200).json({
            error : false,
            message: "success",
            data: "logout success"
        });
    }catch (err) {
        res.status(500).json({
            error : true,
            message: "error",
            data: "internal server error"
        });
    }
}
module.exports = {logout: logout}
