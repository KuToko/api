const dotenv = require('dotenv');
module.exports = {
    "type": "service_account",
    "project_id": "kutoko-app",
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": "access-resource@kutoko-app.iam.gserviceaccount.com",
    "client_id": "105947905583477766119",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/access-resource%40kutoko-app.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}