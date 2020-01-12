const express = require("express");

const router = express.Router();

const Topic = require("../models/Topic");
const Reply = require("../models/Reply");

router.post("/", async function (req, res, next) {
    try {
        const topic = {
            subject: req.body.subject,
            author: req.body.author,
            description: req.body.description
        };
        const createdTopic = await Topic.create(topic);
        return await res.status(201).json({topic: createdTopic});
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
});

router.put("/:topicID", async function (req, res, next) {
    try {
        const topicID = req.params.topicID;
        if (await Topic.findById(topicID)) {
            let fieldsToUpdate = {};
            const data = Object.keys(req.body);
            for (let key of data) {
                if (["description", "subject"].includes(key)) {
                    fieldsToUpdate[key] = req.body[key]
                }
            }
            fieldsToUpdate.date_modified = new Date();
            const updatedTopic = await Topic.findByIdAndUpdate(topicID, fieldsToUpdate, {new: true});
            return await res.status(200).json({topic: updatedTopic, message: "Topic updated"});
        } else {
            return res.status(404).json({error: "Topic not found"});
        }
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
});

router.delete("/:topicID", async function (req, res, next) {
    try {
        const topicID = req.params.topicID;
        if (Topic.findById(topicID)) {
            await Topic.findByIdAndDelete(topicID);
            return res.status(200).json({message: "Topic Deleted"});
        } else {
            return res.status(404).json({error: "Topic not found"});
        }
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
});

router.get("/:topicID", async function (req, res, next) {
    try {
        const topicID = req.params.topicID;
        if (await Topic.findById(topicID)) {
            const topic = await Topic.findById(topicID).populate("author");
            const numberOfReplies = await Reply.find({topic: topicID}).count();
            console.log(numberOfReplies);
            return await res.status(200).json({topic: topic, number_of_replies: numberOfReplies});
        } else {
            return res.status(404).json({error: "Topic not found"});
        }
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
});

router.get("/", async function (req, res, next) {
    try {
        const queryParams = req.query;
        const topics = await Topic.find(queryParams).populate("author");
        return await res.status(200).json({count: topics.length, topics: topics});
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
});

router.put("/:topicID/like", async function (req, res, next) {
    try {
        const topicID = req.params.topicID;
        if (await Topic.findById(topicID)) {
            const topic = await Topic.findById(topicID);
            let likes = topic.likes;
            if (!likes.includes(req.body.user)) {
                likes.push(req.body.user);
                await topic.save();
                const updateTopic = await Topic.findById(topicID);
                return res.status(200).json({topic: updateTopic, message: "Topic liked"});
            } else {
                likes.pop(req.body.user);
                await topic.save();
                const updateTopic = await Topic.findById(topicID);
                return res.status(200).json({topic: updateTopic, message: "Topic unliked"});
            }
        } else {
            return res.status(404).json({error: "Topic not found"});
        }
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
});

router.get("/:topicID/replies", async function (req, res, next) {
    try {
        const topicID = req.params.topicID;
        const replies = await Reply.find({topic: topicID}, {topic: 0}).populate("author");
        const topic = await Topic.findById(topicID).populate("author");
        return await res.status(200).json({count: replies.length, topic: topic, replies: replies});
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
});

router.get("/search", async function (req, res, next) {
    try {
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;
        const query = {
            $and: [{date_posted: {$gte: startDate}}, {date_posted: {$lte: endDate}}]
        };
        const topics = Topic.find(query).sort({"date_posted": -1});
        return res.status(200).json({topics: topics});
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
});

module.exports = router;

