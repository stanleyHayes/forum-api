const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SessionController = require("./SessionsController");
const router = express.Router();
require('dotenv').config();

async function hashPassword(plainTextPassword) {
    return bcrypt.hash(plainTextPassword, 10);
}

async function comparePassword(plainTextPassword, accountPassword) {
    return bcrypt.compare(plainTextPassword, accountPassword);
}

router.post('/register', async function (req, res, next) {
    try {
        const user = {
            email: req.body.email,
            name: req.body.name,
            username: req.body.username,
            password: await hashPassword(req.body.password),
        };

        const userFromDB = await User.findOne({email: req.body.email});
        if (userFromDB) {
            return res.status(409).json({error: "Email Already exists"});
        } else {
            const createdUser = await User.create(user);
            return res.status(201).json({user: createdUser, message: "Account created successfully"});
        }
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});


router.post('/login', async function (req, res, next) {
    try {

        const userPassword = req.body.password;
        const email = req.body.email;
        const userFromDB = await User.findOne({email: email});

        if (await comparePassword(userPassword, userFromDB.password)) {
            const token = jwt.sign({payload: email}, process.env.JWT_SECRET);
            const session = {user_id: email, user_jwt: token};
            await SessionController.createSession(session);

            return res.status(200).json({token: token, user: userFromDB, message: "Login Successful"});

        } else {
            res.status(401).json({error: "Authentication Failed"});
        }
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});


router.put('/:userID', async function (req, res, next) {
    try {
        const userID = req.params.userID;
        const name = req.body.name;
        const imageUri = req.body.imageUri;
        const about = req.body.about;
        if (await User.findById(userID)) {
            if (name && imageUri) {
                const updatedUser = await User.findByIdAndUpdate(userID, {
                    name: name,
                    imageUri: imageUri,
                    about: about
                }, {new: true});
                return res.status(200).json({user: updatedUser, message: "Profile updated successfully"});
            } else if (name && !imageUri) {
                const updatedUser = await User.findByIdAndUpdate(userID, {name: name, about: about}, {new: true});
                return res.status(200).json({user: updatedUser, message: "Profile updated successfully"});
            } else if (imageUri && !name) {
                const updatedUser = await User.findByIdAndUpdate(userID, {
                    imageUri: imageUri,
                    about: about
                }, {new: true});
                return res.status(200).json({user: updatedUser, message: "Profile updated successfully"});
            }
        } else {
            return res.status(404).json({error: "User not found"});
        }
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});


router.post('/logout', async function (req, res, next) {
    try {
        const userJWT = req.get("Authorization").slice("Bearer ".length);
        const response = jwt.verify(userJWT, process.env.JWT_SECRET);
        await SessionController.deleteSession(req.body.email);
        return res.status(200).json({message: "Login Was Successful"});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});


router.post('/recover-password', async function (req, res, next) {
    try {
        const email = req.body.email;
        const newPassword = req.body.new_password;
        let user = await User.findOne({email: email});
        user.password = hashPassword(newPassword);
        user.save();
        const updatedUser = await User.findOne({email: email});
        return res.status(200).json({user: updatedUser, message: "Password Updated"});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});


router.post('/change-password', async function (req, res, next) {
    try {

        const email = req.body.email;
        const oldPassword = req.body.old_password;
        const newPassword = req.body.new_password;
        let user = await User.findOne({email: email});
        if (await comparePassword(oldPassword, user.password)) {
            user.password = hashPassword(newPassword);
            user.save();
            const updatedUser = await User.findOne({email: email});
            return res.status(200).json({user: updatedUser, message: "Password Updated"});
        } else {
            return res.status(401).json({error: "Incorrect Password"});
        }

    } catch (e) {
        res.status(500).json({error: e.message});
    }
});


router.delete('/deactivate', async function (req, res, next) {
    try {

    } catch (e) {
        res.status(500).json({error: e.message});
    }
});


router.get('/', async function (req, res, next) {
    try {
        const queryParams = req.query;
        const users = await User.find(queryParams);
        if (users.length === 0) {
            return res.status(404).json({error: "No user found", users: [], count: 0});
        }
        return res.status(200).json({users: users, count: users.length});
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
});


router.get('/:userID', async function (req, res, next) {
    try {
        const id = req.params.userID;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }
        return res.status(200).json({user: user});
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
});


module.exports = router;