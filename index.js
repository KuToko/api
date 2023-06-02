const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const app = express();
const cors = require('cors');
const midlleware = require('./src/midleware/midleware');
const authRouters = require('./src/routes/auth');
const userRouters = require('./src/routes/user');

const upvoteRouters = require('./src/routes/upvote');


app.use(express.json());
app.use(cors());
// app.use(midlleware)
app.get('/', (req, res) => {
    res.send('Hello World1');
})
app.use("/auth", authRouters);
app.use("/user",userRouters);

app.use("/upvote", upvoteRouters);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
