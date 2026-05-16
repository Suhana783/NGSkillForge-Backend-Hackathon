
module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const response = {
        success: false,
        message: err.message || 'Internal Server Error',
    };

    if (process.env.NODE_ENV !== 'production') {
        response.stack = err.stack;
        if (err.errors) response.errors = err.errors;
    }

    res.status(statusCode).json(response);
};
