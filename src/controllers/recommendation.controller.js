const { businesses, categories, business_categories, sequelize } = require('../models');
const { Op } = require('sequelize');
const { QueryTypes } = require('sequelize');
const Sequelize = require('sequelize');
const axios = require('axios');
const DB = require('../config/knex');
const moment = require('moment');
const helpers = require('../helpers/helpers');

const validator = require('fastest-validator');

const recommendationByUser = async (req, res) => {
    const user_id = helpers.getUserId(req);
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    const page = req.query.page
    const total_row = req.query.total_row

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

    try {
        const request = await axios.get(`https://recommender.kutoko.id/v1/users/${user_id}/recommendation`)
        const data = request.data.data;

        const url = "https://via.placeholder.com/450/DBDBDB?text=";

        const businesses = await DB.select(
            'businesses.id',
            'businesses.name',
            'businesses.google_maps_rating',
            DB.raw(`case when businesses.avatar is null then null else concat(CAST(? AS VARCHAR), businesses.name) end as avatar`, [url]),
            DB.raw(`case when (select user_id from upvotes where business_id = businesses.id and user_id = ? limit 1) is null then 'false' else 'true' end as is_voted`, [user_id]),
            DB.raw(" CAST(count(upvotes.id) AS INTEGER) AS upvotes"),
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
          .innerJoin('upvotes', 'upvotes.business_id', 'businesses.id')
          .where('businesses.id', 'in', data)
          .groupBy('businesses.id', 'businesses.name')
          .paginate({perPage: total_row, currentPage: page});

        return res.status(200).json({
            error: false,
            message: "Success",
            data: businesses.data,
            pagination: businesses.pagination
        });
    }catch (err){
        console.log(err);
        return res.status(500).json({
            error: true,
            message: "Something went wrong",
        });
    }
}

const recommendationByBusiness = async (req, res) => {
  const user_id = helpers.getUserId(req);
  const business_id = req.params.id_business;
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;
  const page = req.query.page
  const total_row = req.query.total_row

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

  try {
      const request = await axios.get(`https://recommender.kutoko.id/v1/businesses/${business_id}/similar`)
      const data = request.data.data;

      const url = "https://via.placeholder.com/450/DBDBDB?text=";

      const businesses = await DB.select(
          'businesses.id',
          'businesses.name',
          'businesses.google_maps_rating',
          DB.raw(`case when businesses.avatar is null then null else concat(CAST(? AS VARCHAR), businesses.name) end as avatar`, [url]),
          DB.raw(`case when (select user_id from upvotes where business_id = businesses.id and user_id = ? limit 1) is null then 'false' else 'true' end as is_voted`, [user_id]),
          DB.raw(" CAST(count(upvotes.id) AS INTEGER) AS upvotes"),
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
        .innerJoin('upvotes', 'upvotes.business_id', 'businesses.id')
        .where('businesses.id', 'in', data)
        .groupBy('businesses.id', 'businesses.name')
        .paginate({perPage: total_row, currentPage: page});

      return res.status(200).json({
          error: false,
          message: "Success",
          data: businesses.data,
          pagination: businesses.pagination
      });
  }catch (err){
      console.log(err);
      return res.status(500).json({
          error: true,
          message: "Something went wrong",
      });
  }
}

module.exports = {
    recommendationByUser, recommendationByBusiness
}