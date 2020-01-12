const express = require("express");

const Session = require("../models/Session");

class SessionsController {
    static async createSession(session) {
        return Session.create(session);
    }

    static async getSession(email){
        return Session.findOne({user_id: email});
    }

    static async updateSession(email, jwt){
        return Session.findOneAndUpdate({user_id: email}, {user_jwt, jwt});
    }

    static async deleteSession(email){
        return Session.findOneAndDelete({user_id: email});
    }
}

module.exports = SessionsController;