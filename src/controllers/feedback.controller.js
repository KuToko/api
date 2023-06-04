const DB = require('../config/knex');
const validator = require('fastest-validator');
const moment = require('moment');
const helpers = require('../helpers/helpers');

const list = async (req, res) => {
    try {
        const business_id = req.query.business_id;
        const page = req.query.page;

        const params = {business_id}

        const schema = {
          business_id: {type: "string", optional: false}
        }
        const validate = new validator().validate(params, schema);

        if (validate.length) {
            return res.status(400).json({
                message: "error",
                data: validate
            });
        }

        const feedbacks = await DB('feedbacks')
        .select(
          'feedbacks.*',
          'users.name as user_name'
        )
        .join('users', 'feedbacks.user_id', '=', 'users.id')
        .orderBy('feedbacks.created_at', 'desc')
        .where('feedbacks.business_id', business_id) 
        .limit(5)
        .paginate({perPage: 5, currentPage: page});

        return res.status(200).json({
            error: false,
            message: "success",
            data: feedbacks,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error : true,
            message: "error",
            data: err
        });
    }
}

const store = async (req, res) => {
    try {
        const params = req.body;
        const schema = {
            business_id: {type: "string", optional: false},
            feedbacks: {type: "string", optional: false},
        };
        const validate = new validator().validate(params, schema);

        if (validate.length) {
            return res.status(400).json({
                message: "error",
                data: validate
            });
        }
        const feedback = await DB('feedbacks').insert({
            business_id: params.business_id,
            user_id: helpers.getUserId(req),
            feedbacks: params.feedbacks,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        });

        return res.status(200).json({
            error: false,
            message: "success",
            data: feedback,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error : true,
            message: "Something went wrong",
            data: err
        });
    }
}
    

module.exports = {
  list, store
}