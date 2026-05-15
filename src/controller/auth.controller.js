const {
    registerUserService,
    verifyOTPService
} = require ('../services/auth.service')


exports.registerUser = async (req, res) => {
    try {
        const result = await registerUserService(req.body);

        res.status(201).json({
            success: true,
            message: result.message
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}