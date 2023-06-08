const { businesses, categories, business_categories, sequelize } = require('../models');
const { Op } = require('sequelize');
const { QueryTypes } = require('sequelize');
const Sequelize = require('sequelize');
const axios = require('axios');
const DB = require('../config/knex');
const moment = require('moment');
const helpers = require('../helpers/helpers');

const validator = require('fastest-validator');


const search = async (req, res) => {
    const user_id = helpers.getUserId(req);
    try {
        const latitude = req.query.latitude;
        const longitude = req.query.longitude;
        const page = req.query.page;
        const q = req.query.q;

        const params = {latitude, longitude, q}

        const schema = {
            latitude: {type: "string", optional: false},
            longitude: {type: "string", optional: false},
            q: {type: "string", optional: false}
        }
        const v = new validator();
        const validate = v.validate(params, schema);

        if (validate.length) {
            return res.status(400).json({
                message: "error",
                data: validate
            });
        }
        const url = "https://via.placeholder.com/450/DBDBDB?text="

        const businesses = await DB.select(
            'businesses.id',
            'businesses.name',
            'businesses.google_maps_rating',
            DB.raw(`case when businesses.avatar is null then null else concat(CAST(? AS VARCHAR), businesses.name) end as avatar`, [url]),
            DB.raw(`case when (select user_id from upvotes where business_id = businesses.id and user_id = ? limit 1) is null then 'false' else 'true' end as is_voted`, [user_id]),
            DB.raw("json_agg(json_build_object('id',categories.id,'name',categories.name)) AS categories"),
            DB.raw(`
              6371 * ACOS(
                COS(RADIANS(CAST(latitude AS FLOAT))) *
                COS(RADIANS(CAST(? AS FLOAT))) *
                COS(RADIANS(CAST(longitude AS FLOAT)) - RADIANS(CAST(? AS FLOAT))) +
                SIN(RADIANS(CAST(latitude AS FLOAT))) *
                SIN(RADIANS(CAST(? AS FLOAT)))
              ) AS distance_in_m
            `, [latitude, longitude, latitude]),
            DB.raw(`
              6371 * ACOS(
                COS(RADIANS(CAST(latitude AS FLOAT))) *
                COS(RADIANS(CAST(? AS FLOAT))) *
                COS(RADIANS(CAST(longitude AS FLOAT)) - RADIANS(CAST(? AS FLOAT))) +
                SIN(RADIANS(CAST(latitude AS FLOAT))) *
                SIN(RADIANS(CAST(? AS FLOAT)))
              ) / 1000 AS distance_in_km
            `, [latitude, longitude, latitude])
          )
          .from('businesses')
          .join('business_categories', 'businesses.id', '=', 'business_categories.business_id')
          .join('categories', 'business_categories.category_id', '=', 'categories.id')
          .where('businesses.name', 'like', `%${q}%`)
          .orWhere('categories.name', 'like', `%${q}%`)
          .groupBy('businesses.id', 'businesses.name')
          .orderBy('distance_in_m')
          .paginate({perPage: 10, currentPage: page});
        
        return res.status(200).json({
            error: false,
            message: "Success",
            data: businesses.data,
            pagination: businesses.pagination
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: true,
            message: "Something went wrong",
        });
    }

}

const detail = async (req, res) => {
    try {
        const business_id = req.params.id;
        const params = {business_id}

        const schema = {
            business_id: {type: "string", optional: false}
        }
        const v = new validator();
        const validate = v.validate(params, schema);

        if (validate.length) {
            return res.status(400).json({
                message: "error",
                data: validate
            });
        }

        const url = "https://via.placeholder.com/450/DBDBDB?text="

        const business = await DB("businesses").select(
              'businesses.id',
              'businesses.name AS business_name',
              'businesses.username AS business_username',
              'businesses.address',
              'businesses.postal_code',
              DB.raw(`case when businesses.avatar is null then null else concat(CAST(? AS VARCHAR), businesses.name) end as avatar`, [url]),
              'businesses.description',
              'businesses.latitude',
              'businesses.longitude',
              'businesses.released_at',
              'businesses.google_maps_rating',
              'businesses.is_monday_open',
              'businesses.monday_start_time',
              'businesses.monday_end_time',
              'businesses.monday_notes',
              'businesses.is_tuesday_open',
              'businesses.tuesday_start_time',
              'businesses.tuesday_end_time',
              'businesses.tuesday_notes',
              'businesses.is_wednesday_open',
              'businesses.wednesday_start_time',
              'businesses.wednesday_end_time',
              'businesses.wednesday_notes',
              'businesses.is_thursday_open',
              'businesses.thursday_start_time',
              'businesses.thursday_end_time',
              'businesses.thursday_notes',
              'businesses.is_friday_open',
              'businesses.friday_start_time',
              'businesses.friday_end_time',
              'businesses.friday_notes',
              'businesses.is_saturday_open',
              'businesses.saturday_start_time',
              'businesses.saturday_end_time',
              'businesses.saturday_notes',
              'businesses.is_sunday_open',
              'businesses.sunday_start_time',
              'businesses.sunday_end_time',
              'businesses.sunday_notes',
              'businesses.place_id',
              'businesses.added_from_system',
              'businesses.link_theme',
              DB.raw("json_agg(json_build_object('id', categories.id, 'name', categories.name)) AS categories"),
              DB.raw("count(upvotes.id) AS upvotes"),
              'users.id AS user_id',
              'users.name AS user_name',
              'users.email AS user_email'
            )
            .leftJoin('users', 'businesses.claim_by', 'users.id')
            .innerJoin('business_categories', 'businesses.id', 'business_categories.business_id')
            .innerJoin('categories', 'business_categories.category_id', 'categories.id')
            .innerJoin('upvotes', 'upvotes.business_id', 'businesses.id')
            .where('businesses.id', business_id)
            .groupBy(
              'businesses.id',
              'users.id',
            )
            .first();

            // /businesses/{id}
            // /businesses/{id}/feedbacks
            
        return res.status(200).json({
            error: false,
            message: "Success",
            data: business
        });

        console.log(business);
    } catch (err) {
        console.log(err);
        return  res.status(500).json({
            error: true,
            message: "error",
        });
    }

}

const list = async (req, res) => {
    const user_id = helpers.getUserId(req);
    const total_row = req.query.total_row;
    try {
        const latitude = req.query.latitude;
        const longitude = req.query.longitude;
        const page = req.query.page;

        const params = {latitude, longitude}

        const schema = {
            latitude: {type: "string", optional: false},
            longitude: {type: "string", optional: false}
        }
        const v = new validator();
        const validate = v.validate(params, schema);

        if (validate.length) {
            return res.status(400).json({
                message: "error",
                data: validate
            });
        }
        const url = "https://via.placeholder.com/450/DBDBDB?text="

        const businesses = await DB.select(
            'businesses.id',
            'businesses.name',
            'businesses.google_maps_rating',
            DB.raw(`case when businesses.avatar is null then null else concat(CAST(? AS VARCHAR), businesses.name) end as avatar`, [url]),
            DB.raw(`case when (select user_id from upvotes where business_id = businesses.id and user_id = ? limit 1) is null then 'false' else 'true' end as is_voted`, [user_id]),
            DB.raw("json_agg(json_build_object('id',categories.id,'name',categories.name)) AS categories"),
            DB.raw(`
              6371 * ACOS(
                COS(RADIANS(CAST(latitude AS FLOAT))) *
                COS(RADIANS(CAST(? AS FLOAT))) *
                COS(RADIANS(CAST(longitude AS FLOAT)) - RADIANS(CAST(? AS FLOAT))) +
                SIN(RADIANS(CAST(latitude AS FLOAT))) *
                SIN(RADIANS(CAST(? AS FLOAT)))
              ) AS distance_in_m
            `, [latitude, longitude, latitude]),
            DB.raw(`
              6371 * ACOS(
                COS(RADIANS(CAST(latitude AS FLOAT))) *
                COS(RADIANS(CAST(? AS FLOAT))) *
                COS(RADIANS(CAST(longitude AS FLOAT)) - RADIANS(CAST(? AS FLOAT))) +
                SIN(RADIANS(CAST(latitude AS FLOAT))) *
                SIN(RADIANS(CAST(? AS FLOAT)))
              ) / 1000 AS distance_in_km
            `, [latitude, longitude, latitude])
          )
          .from('businesses')
          .join('business_categories', 'businesses.id', '=', 'business_categories.business_id')
          .join('categories', 'business_categories.category_id', '=', 'categories.id')
          .groupBy('businesses.id', 'businesses.name')
          .orderBy('distance_in_m')
          .paginate({perPage: total_row, currentPage: page});
        
        return res.status(200).json({
            error: false,
            message: "Success",
            data: businesses.data,
            pagination: businesses.pagination
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: true,
            message: "Something went wrong",
        });
    }
}

module.exports = {
    list, detail, search
}