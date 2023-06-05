const DB = require('../config/knex');
const validator = require('fastest-validator');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
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

        const products = await DB('products')
        .select(
          '*'
        )
        .orderBy('created_at', 'desc')
        .where('business_id', business_id) 
        .paginate({perPage: 10, currentPage: page});

        return res.status(200).json({
            error: false,
            message: "success",
            data: products.data,
            pagination: products.pagination
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
        const { product_image } = req.files;
        params.product_image = product_image;

        const schema = {
            business_id: {type: "string", optional: false},
            name: {type: "string", optional: false},
            price: {type: "string", optional: false},
            description: {type: "string", optional: false},
            product_image: {type: "object" ,optional: false},

        };
        const validate = new validator().validate(params, schema);

        if (validate.length) {
            return res.status(400).json({
                message: "error",
                data: validate
            });
        }

       // If does not have image mime type prevent from uploading
        const mime = /^image/
        console.log(product_image.mimetype)
        if (!mime.test(product_image.mimetype)) return res.sendStatus(400);

        const uploadpath = path.join(__dirname, '../public/upload/');
        console.log(uploadpath);
        // Move the uploaded product_image to our upload folder
        const filename = `${Date.now()}-${product_image.name}`;
        product_image.name = filename;
        product_image.mv(uploadpath + product_image.name);

        /**
         * TODO(developer): Uncomment the following lines before running the sample.
         */
        // The ID of your GCS bucket
        const bucketName = 'kutoko-app';

        // The path to your file to upload
        const filePath = `${uploadpath}${filename}`;

        // The new ID for your GCS file
        const destFileName = 'product-images/'+filename;

        // Imports the Google Cloud client library
        const {Storage} = require('@google-cloud/storage');

        // Creates a client
        const storage = new Storage({
            keyFilename: path.join(__dirname, '../../serviceAccount.json'),
        });

        async function uploadFile() {
            const options = {
                destination: destFileName,
                // Optional:
                // Set a generation-match precondition to avoid potential race conditions
                // and data corruptions. The request to upload is aborted if the object's
                // generation number does not match your precondition. For a destination
                // object that does not yet exist, set the ifGenerationMatch precondition to 0
                // If the destination object already exists in your bucket, set instead a
                // generation-match precondition using its generation number.
              };
            
            await storage.bucket(bucketName).upload(filePath, options);
            console.log(`${filePath} uploaded to ${bucketName}/product-images/`);
        }

        uploadFile().catch(console.error);

        const product = await DB('products').insert({
            business_id: params.business_id,
            name: params.name,
            price: params.price,
            description: params.description,
            product_image: destFileName,
        });
        
        return res.status(200).json({
            error: false,
            message: "success",
            data: {
                business_id: params.business_id,
                name: params.name,
                price: params.price,
                description: params.description,
                product_image: destFileName
            }
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

const detail = async (req, res) => {

}

const update = async (req, res) => {
    
}

const destroy = async (req, res) => {
    
}
    

module.exports = {
  list, store, detail, update, destroy
}