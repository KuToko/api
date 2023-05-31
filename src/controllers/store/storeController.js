const {business} = require('../models');

const findStore = async (req, res) => {
    try {
        const { params: { id } } = req;
        const user = await business.findAll();
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
    findStore
}