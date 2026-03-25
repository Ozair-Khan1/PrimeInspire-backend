const mongoose = require('mongoose')
const userModel = require('../models/auth.model')
const jwt = require('jsonwebtoken')
const sendEmail = require('../services/email.service')
const otpBody = require('../utils/utils')
const otpModel = require('../models/otp.model')
const bcrypt = require('bcrypt')

const register = async (req, res) => {
    const {fullname, email} = req.body

    const userExists = await userModel.findOne({
        fullname,
        email
    })

    if(userExists) {
        return res.status(409).json({
            message: 'User exists'
        })
    }

    const user = await userModel.create({
        fullname,
        email
    });

    const otp = otpBody.generateOtp()
    const html = otpBody.getOtpHtml(otp)

    const otpHash = await bcrypt.hash(otp, 10)

    await otpModel.create({
        email,
        user: user._id,
        otpHash
    })

    await sendEmail(email, "OTP Verification", `Your OTP code is ${otp}`, html)

    const emailToken = jwt.sign({
        id: user._id
    }, process.env.JWT_KEY)

    res.cookie('emailToken', emailToken)

    res.status(201).json({
        message: 'User created',
        user: {
            name: user.fullname,
            email: user.email,
            verified: user.verified
        }
    })
}

const login = async (req, res) => {
    const {email} = req.body

    const emailExist = await userModel.findOne({email})

    if(!emailExist) {
        return res.status(404).json({
            message: 'User does not exists'
        })
    }

    const emailToken = jwt.sign({
        id: emailExist._id
    }, process.env.JWT_KEY)

    res.cookie('emailToken', emailToken, {
        httpOnly: true,
        secure: true, 
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({
        message: 'Logged in'
    })

}

const logout = async (req, res) => {
    
    try {

        res.clearCookie('session', {
            httpOnly: true,
            secure: true,     
            sameSite: 'none',  
        });
           
        res.status(200).json({
            message: 'Logged out'
        })
    } catch (error) {
        console.log(error)
    }

}


const verify = async (req, res) => {
    try {
        const token = req.cookies.emailToken;

        if (!token) {
            return res.status(401).json({ message: 'Session expired. Please register again.' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_KEY);
        } catch (err) {
            return res.status(402).json({ message: 'Invalid or expired session token.' });
        }

        const userId = decoded.id
        
        console.log("received", req.body)

        const { otp } = req.body

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otpRecord = await otpModel.findOne({ email: user.email });
        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP expired or not found' });
        }

        const isMatch = await bcrypt.compare(otp, otpRecord.otpHash);

        if (!isMatch) {
            return res.status(406).json({ message: 'Invalid OTP code' });
        }

        const updateUser = await userModel.findByIdAndUpdate(userId, {
            verified: true
        })

        console.log(updateUser)

        await otpModel.deleteMany()

        res.clearCookie('emailToken')

        const session =  jwt.sign({
            id: updateUser._id
        }, process.env.JWT_KEY)

        res.cookie('session', session)

        res.status(200).json({ success: true, message: 'Account verified!', id: updateUser._id});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during verification' });
    }

}

const getUser = async (req, res) => {
    const token = req.cookies.session;

    if(!token) {
        return res.status(401).json({
            message: 'token not found'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY)

        const user = await userModel.findById({_id: decoded.id})
        res.status(200).json({
            message: 'user found',
            "id": user.id,
            "email": user.email
        })
    } catch (error) {
        console.log(error)
    }
}

const resendCode = async (req, res) => {
    const token = req.cookies.emailToken;

    if(!token) {
        return res.status(404).json({
            message: 'Token not found'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY)

        const user = await userModel.findById({_id: decoded.id})

        console.log(user)

        const otp = otpBody.generateOtp()
        const html = otpBody.getOtpHtml(otp)

        const otpHash = await bcrypt.hash(otp, 10)

        await otpModel.deleteMany()

        await otpModel.create({
            email: user.email,
            user: user._id,
            otpHash
        })

        await sendEmail(user.email, "OTP Verification", `Your OTP code is ${otp}`, html)

        res.status(200).json({
            message: 'Otp sent successfully'
        })

    } catch (error) {
        console.log(error)
    }
}

module.exports = {register, verify, login, logout, getUser, resendCode}