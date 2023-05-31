const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const app = express();
const midlleware = require('./src/midleware/midleware');
const authRouters = require('./src/routes/auth');
const userRouters = require('./src/routes/user');
const businessRouters = require('./src/routes/business');


app.use(express.json());
// app.use(midlleware)
app.get('/', (req, res) => {
    res.send('Hello World1');
})
app.use("/auth", authRouters);
app.use("/user",userRouters);
app.use("/business",businessRouters);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
