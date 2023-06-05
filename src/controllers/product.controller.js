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
        params.product_image = req.files;

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

        const { product_image } = req.files;

       // If does not have image mime type prevent from uploading
        const mime = /^image/
        if (!mime.test(product_image.mimetype)) return res.sendStatus(400).json({message: "error", data: "Invalid image"});

        const uploadpath = path.join(__dirname, '../public/upload/');
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
            fs.unlink(filePath, (err)=>{
                console.log(err ? "error deleting file" : "file on local deleted");
            });
        }


        uploadFile()
        .catch((err) => { console.log(err) });

        const product = await DB('products').insert({
            business_id: params.business_id,
            name: params.name,
            price: params.price,
            description: params.description,
            product_image: `https://storage.googleapis.com/kutoko-app/${destFileName}`,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        .returning('*');
        
        return res.status(200).json({
            error: false,
            message: "success",
            product: product[0]
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
    try{
        const id = req.params.id;
        const product = await DB('products').where('id', id).first();

        if (!product) {
            return res.status(200).json({
                error : false,
                message: "product not found",
            });
        }

        return res.status(200).json({
            error: false,
            message: "success",
            data: product
        });

    }catch(err){
        console.log(err);
        res.status(500).json({
            error : true,
            message: "error",
            data: err
        });
    }

}

const update = async (req, res) => {
    const id = req.params.id;
    try{

        const params = req.body;
        params.product_image = req.files;

        const schema = {
            business_id: {type: "string", optional: false},
            name: {type: "string", optional: false},
            price: {type: "string", optional: false},
            description: {type: "string", optional: false}

        };
        const validate = new validator().validate(params, schema);

        if (validate.length) {
            return res.status(400).json({
                message: "error",
                data: validate
            });
        }

        if(req.files !== null){
            const { product_image } = req.files;

            // If does not have image mime type prevent from uploading
            const mime = /^image/
            if (!mime.test(product_image.mimetype)) return res.sendStatus(400).json({message: "error", data: "Invalid image"});

            const uploadpath = path.join(__dirname, '../public/upload/');
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
                fs.unlink(filePath, (err)=>{
                    console.log(err ? "error deleting file" : "file on local deleted");
                });
            }


            uploadFile()
            .catch((err) => { console.log(err) });
            //update product using id knex js
            const product = await DB('products').where('id', id).update({
                business_id: params.business_id,
                name: params.name,
                price: params.price,
                description: params.description,
                product_image: `https://storage.googleapis.com/kutoko-app/${destFileName}`,
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            }).returning('*');

            return res.status(200).json({
                error: false,
                message: "success",
                data: product
            });

        }else{
            const product = await DB('products').where('id', id).update({
                business_id: params.business_id,
                name: params.name,
                price: params.price,
                description: params.description,
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            }).returning('*');

            return res.status(200).json({
                error: false,
                message: "success",
                data: product
            });
        }
    }catch(err){
        console.log(err);
        res.status(500).json({
            error : true,
            message: "error",
            data: err
        });
    }
    
}

const destroy = async (req, res) => {
    const id = req.params.id;

    try{
        //delete product using id knex js
        const product = await DB('products').where('id', id).del().returning('*');
        if (product.length === 0) {
            return res.status(200).json({
                error : false,
                message: "product not found",
            });
        }

        return res.status(200).json({
            error: false,
            message: "product deleted",
            data: product[0]
        });

    }catch(err){
        console.log(err);
        res.status(500).json({
            error : true,
            message: "error",
            data: err
        });
    }
    
}
    

module.exports = {
  list, store, detail, update, destroy
}