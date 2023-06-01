const {users, upvotes, businesses} = require("../../models");
const validator = require("fastest-validator");
const uuid = require("uuid");


const findAll=async (req, res) => {
    try {
        const data = await upvotes.findAll({
            include: {
                model: businesses,
                attributes: ["name"],
                required: true
            }
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

const findByUserId = async (req, res) => {
    const userId = req.params.id;
    try {
        const data = await upvotes.findAll({
            include:[
                {
                model: users,
                attributes: ["name"],
                required: true
            },
                {
                    model: businesses,
                    attributes: ["name"],
                    required: true
                }
            ],
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

const createVote = async (req, res) => {
    const userId = req.params.id;
    const data={
        id: uuid.v4(),
        user_id: userId,
        business_id: req.body.business_id,
        created_at: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
        updated_at: new Date().toISOString().replace(/T/, " ").replace(/\..+/, "")
    }

    const schema = {
        business_id: {type: "string", optional: false, max: "100"},
    }
    const v = new validator();
    const validateRes = v.validate(data, schema);
    if (validateRes.length) {
        return res.status(400).json({
            error: true,
            message: "validation error",
            data: validateRes
        });
    }
    try {
        // console.log(data);
        await upvotes.create({
            id: data.id,
            user_id: data.user_id,
            business_id: data.business_id,
            created_at: data.created_at,
            updated_at: data.updated_at
        });
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

const deleteVote = async (req, res) => {
    const id = req.params.id;
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
    findAll,
    findByUserId,
    createVote,
    deleteVote
}
