module.exports = {

    // Error Handler
    errorHandler: (fn) => (req, res, next) => {
        Promise.resolve(fn(req, res, next))
                .catch(next);
    }
};