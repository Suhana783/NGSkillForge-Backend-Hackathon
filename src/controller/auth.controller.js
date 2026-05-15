
const {
    registerUserService,
    verifyOTPService,
    loginUserService,
    refreshTokenService,
} = require('../services/auth.service');

exports.registerUser = async (req, res) => {
    try {
        const result = await registerUserService(req.body);
        res.status(201).json({success: true, message: result.message, userId: result.userId});
    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const result = await verifyOTPService(req.body);
        res.status(200).json({success: true, message: result.message});
    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }
};

exports.loginUser = async (req, res) => {
    try {
        const result = await loginUserService(req.body);
        res.status(200).json({success: true, ...result});
    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const result = await refreshTokenService(req.body);
        res.status(200).json({success: true, ...result});
    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }
};