const logRequset = (req, res, next) => {
    console.log("Request received");
    next();
}

module.exports = logRequset;
