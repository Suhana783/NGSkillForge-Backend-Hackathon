const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user.model');

const accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'access_secret_dev';
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'refresh_secret_dev';

const createAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            email: user.email,
            role: user.role,
        },
        accessTokenSecret,
        { expiresIn: '15m' }
    );
};

const createRefreshToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            email: user.email,
        },
        refreshTokenSecret,
        { expiresIn: '7d' }
    );
};

const sendOTPEmail = async (email, otp) => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error('SMTP_USER and SMTP_PASS are required to send Gmail OTP email');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Your OTP code',
        text: `Your verification code is ${otp}. It expires in 5 minutes.`,
    });

    console.log('Email sent:', info.messageId);
};

const registerUserService = async (userData) => {
    const {name, email, password, role} = userData;

    const existingUser = await User.findOne({email});

    if (existingUser) {
        throw new Error('Email already exists');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 5 * 60 * 1000; 
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        otp,
        otpExpiry,
    });

    await sendOTPEmail(email, otp);

    return {
        message: 'User created and OTP sent',
        userId: user._id,
    };
};

const loginUserService = async ({email, password}) => {
    const user = await User.findOne({email});

    if (!user) throw new Error('Invalid email or password');
    if (!user.isVerified) throw new Error('Please verify your account first');

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return {
        message: 'Login successful',
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

const refreshTokenService = async ({refreshToken}) => {
    if (!refreshToken) {
        throw new Error('Refresh token is required');
    }

    const decoded = jwt.verify(refreshToken, refreshTokenSecret);
    const user = await User.findById(decoded.userId);

    if (!user) throw new Error('User not found');
    if (user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
    }

    const newAccessToken = createAccessToken(user);

    return {
        message: 'Access token refreshed',
        accessToken: newAccessToken,
    };
};

const verifyOTPService = async ({email, otp}) => {
    const user = await User.findOne({email});
    if (!user) throw new Error('User not found');
    if (user.isVerified) throw new Error('User already verified');
    if (!user.otp || !user.otpExpiry) throw new Error('No OTP found for user');

    if (Date.now() > new Date(user.otpExpiry).getTime()) {
        throw new Error('OTP expired');
    }

    if (user.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    return {message: 'User verified successfully'};
};

module.exports = {
    registerUserService,
    verifyOTPService,
    loginUserService,
    refreshTokenService,
};
