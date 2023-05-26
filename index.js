const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const app = express();
const midlleware = require('./src/midleware/midleware');
const usersRouter = require('./src/routes/users');


app.use(express.json());
app.use(midlleware)
app.get('/', (req, res) => {
    res.send('Hello World1');
})
app.use("/users", usersRouter)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
