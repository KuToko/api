const { businesses, categories, business_categories, sequelize } = require('../../models');
const { Op } = require('sequelize');
const { QueryTypes } = require('sequelize');
const Sequelize = require('sequelize');

const validator = require('fastest-validator');


const findStore = async (req, res) => {
    try {
        const latitude = req.query.latitude;
        const longitude = req.query.longitude;
        const q = req.query.q;

        const data = {latitude, longitude, q}

        const schema = {
            latitude: {type: "string", optional: false},
            longitude: {type: "string", optional: false},
            q: {type: "string", optional: false}
        }
        const v = new validator();
        const validate = v.validate(data, schema);

        if (validate.length) {
            return res.status(400).json({
                message: "error",
                data: validate
            });
        }

        const name = `%${q}%`;

        const get_business = await sequelize.query(`
        SELECT businesses.name, categories.name AS category,
            6371 * ACOS(COS(RADIANS(CAST(latitude AS FLOAT))) * COS(RADIANS(CAST(:latitude AS FLOAT))) * COS(RADIANS(CAST(longitude AS FLOAT)) - RADIANS(CAST(:longitude AS FLOAT))) + SIN(RADIANS(CAST(latitude AS FLOAT))) * SIN(RADIANS(CAST(:latitude AS FLOAT)))) AS distance_in_m,
            6371 * ACOS(COS(RADIANS(CAST(latitude AS FLOAT))) * COS(RADIANS(CAST(:latitude AS FLOAT))) * COS(RADIANS(CAST(longitude AS FLOAT)) - RADIANS(CAST(:longitude AS FLOAT))) + SIN(RADIANS(CAST(latitude AS FLOAT))) * SIN(RADIANS(CAST(:latitude AS FLOAT)))) / 1000 AS distance_in_km
        FROM businesses
        INNER JOIN business_categories ON businesses.id = business_categories.business_id
        INNER JOIN categories ON business_categories.category_id = categories.id
        WHERE businesses.name LIKE :name OR categories.name LIKE :name
        ORDER BY distance_in_m
        LIMIT 20
        `, {
            replacements: { latitude, longitude, name },
            type: Sequelize.QueryTypes.SELECT,
        });
          
        
        console.log(get_business);
        return res.status(200).json({
            message: "success",
            data: get_business
        });
    } catch (err) {
        console.log(err);
        return  res.status(500).json({
            message: "error",                                                           
            data: err
        });
    }

}
module.exports = {
    findStore
}