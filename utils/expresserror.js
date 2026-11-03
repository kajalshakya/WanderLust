
// ==========================================
// Custom Express Error Class
// ==========================================

class ExpressError extends Error {

    // Constructor to initialize status code and error message
    constructor(statusCode, message) {
        super();

        this.statusCode = statusCode;
        this.message = message;
    }

}


// Export Custom Error Class
module.exports = ExpressError;
