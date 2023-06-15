const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const app = express();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const routesV1 = require('./src/routes/v1');
const DB = require('./src/config/knex');
const { attachPaginate } = require('knex-paginate');
attachPaginate();


app.use(fileUpload({
    limits: {
        fileSize: 5000000, // 5 MB limit
    },
    abortOnLimit: true,
}));
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send('<center style="font-size:40px;margin-top:23%">Kutoko Service 👋</center>');
})
app.use("/v1", routesV1);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
