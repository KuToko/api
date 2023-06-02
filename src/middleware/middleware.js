const request = (req, res, next) => {
    console.log("Request received");
    next();
}

module.exports = request;
