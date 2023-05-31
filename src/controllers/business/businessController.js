const { businesses, categories, business_categories, sequelize } = require('../../models');
const { Op } = require('sequelize');
const { QueryTypes } = require('sequelize');

const findStore = async (req, res) => {
    try {
        const { name_or_categories, latitude, longitude } = req.params;
        // const get_business = await businesses.findAll({
        //     include: [
        //         { model: business_categories, include: [{ model: categories }]},
        //     ],
        //     where: {
        //         [Op.or]: [{
        //             name: {
        //                 [Op.like]: `%${name_or_categories}%`
        //             },
        //             categories: {
        //                 [Op.like]: `%${name_or_categories}%`
        //             }
        //         }],
        //         latitude: {
        //             [Op.between]: [latitude - 0.5, latitude + 0.5]

        //         },
        //         longitude: {
        //             [Op.between]: [longitude - 0.5, longitude + 0.5]
        //         }
        //     }
        // });
        const sql = `SELECT  businesses.name, categories.name as category,
        6371 * ACOS(COS(RADIANS(CAST(latitude AS FLOAT))) * COS(RADIANS(CAST( ${latitude} AS FLOAT))) * COS(RADIANS(CAST(longitude AS FLOAT)) - RADIANS(CAST(${longitude} AS FLOAT))) + SIN(RADIANS(CAST(latitude AS FLOAT))) * SIN(RADIANS(CAST( ${latitude} AS FLOAT)))) AS distance_in_m,
        6371 * ACOS(COS(RADIANS(CAST(latitude AS FLOAT))) * COS(RADIANS(CAST( ${latitude} AS FLOAT))) * COS(RADIANS(CAST(longitude AS FLOAT)) - RADIANS(CAST(${longitude} AS FLOAT))) + SIN(RADIANS(CAST(latitude AS FLOAT))) * SIN(RADIANS(CAST( ${latitude} AS FLOAT)))) / 1000 AS distance_in_km
        FROM businesses
        INNER JOIN business_categories ON businesses.id = business_categories.business_id
        INNER JOIN categories ON business_categories.category_id = categories.id
        WHERE businesses.name LIKE '%${name_or_categories}%' OR categories.name LIKE '%${name_or_categories}%'
        ORDER BY distance_in_m
        LIMIT 20`;
        
        const get_business = await sequelize.query(sql);
        
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