const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const app = express();
const usersRouter = require('./src/routes/users');
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use("/users", usersRouter)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
