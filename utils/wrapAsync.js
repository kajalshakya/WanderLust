
// ==========================================
// Async Error Handling Wrapper
// ==========================================

module.exports = (fn) => {

    return (req, res, next) => {

        // Catch asynchronous errors and pass them to Express error handler
        fn(req, res, next).catch(next);

    };

};
