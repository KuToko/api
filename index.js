const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const app = express();
const cors = require('cors');
const routesV1 = require('./src/routes/v1');
const DB = require('./src/config/knex');
const { attachPaginate } = require('knex-paginate');
attachPaginate();



app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello World1');
})
app.use("/v1", routesV1);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
