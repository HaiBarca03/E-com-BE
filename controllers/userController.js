const UserModel = require('../models/UserModel')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { genneralAccessToken, genneralRefreshToken, refreshTokenJwt } = require('../middleware/jwtService')

const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: 'User does not exists' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid information' })
        }

        const refresh_token = await genneralRefreshToken({
            id: user.id,
            isAdmin: user.isAdmin
        })

        const access_token = await genneralAccessToken({
            id: user.id,
            isAdmin: user.isAdmin
        })

        console.log('access_token', access_token)
        const response = {
            success: true,
            access_token: access_token,
        };

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            samesite: 'strict'
        });
        res.json(response);

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Error' })
    }
}

const registerUser = async (req, res) => {
    const { name, email, password, comfirmPassword, phone } = req.body

    try {
        // check user exists
        const exists = await UserModel.findOne({ email })
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }
        // if (phone.length !== 10) {
        //     return res.json({ success: false, message: 'Please enter a valid phone' })
        // }
        // check validating email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter a valid email' })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: 'Please enter a strong password' })
        }

        // check confitm password
        if (password !== comfirmPassword) {
            return res.json({ success: false, message: 'Password is not the same' })
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new UserModel({
            // name: name,
            email: email,
            // phone: phone,
            password: hashedPassword,
        })

        const user = await newUser.save()

        res.json({
            success: true,
            data: newUser,
            message: 'create acc success'
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Error' })
    }
}

const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { name, email, phone, password } = req.body;

    try {
        // Check if the user exists
        const checkUser = await UserModel.findById(userId);
        if (!checkUser) {
            return res.json({ success: false, message: 'User does not exist' });
        }

        // Update the user
        const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, { new: true });

        if (!updatedUser) {
            return res.json({ success: false, message: 'Failed to update user' });
        }

        // Return success response
        res.json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error updating user' });
    }
}

const deleteUser = async (req, res) => {
    const userId = req.params.id;
    const token = req.headers

    try {
        // Check if the user exists
        const checkUser = await UserModel.findById(userId);
        if (!checkUser) {
            return res.json({ success: false, message: 'User does not exist' });
        }

        // Update the user
        const deletedUser = await UserModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.json({ success: false, message: 'Failed to update user' });
        }

        // Return success response
        console.log('token:', token)
        res.json({
            success: true,
            message: 'user deleted'
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error updating user' });
    }
}

const getAllUser = async (req, res) => {
    try {
        const getAllUser = await UserModel.find();
        res.json({
            success: true,
            data: getAllUser,
            message: 'user all'
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error updating user' });
    }
}

const getDetailUser = async (req, res) => {
    const userId = req.params.id;
    const token = req.headers

    try {
        // Check if the user exists
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }

        // Return success response
        res.json({
            success: true,
            data: user,
            message: 'detail user'
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error get detail user' });
    }
}

const refreshToken = async (req, res) => {
    // console.log('req.cookies: ', req.cookies)
    const token = req.cookies.refresh_token
    // const token = req.cookies.token.split(' ')[1]
    try {
        if (!token) {
            return res.json({ success: false, message: 'token does not find' });
        }
        const response = await refreshTokenJwt(token)

        // Return success response
        res.json({
            success: true,
            response: response,
            refresh_token: token,
            message: 'token'
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error get detail user' });
    }
}

const logOutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token');
        return res.json({
            success: true,
            status: 'OK',
            message: 'logout success'
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error logout user' });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logOutUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser,
    refreshToken
}