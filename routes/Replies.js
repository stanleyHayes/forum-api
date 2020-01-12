const express = require("express");

const router = express.Router();

const Topic = require("../models/Topic");
const Reply = require("../models/Reply");

router.post("/", async function (req, res, next) {
    try {
        const reply = {
            author: req.body.author,
            reply: req.body.reply,
            topic: req.body.topic
        };
        const createdReply = await Reply.create(reply);
        return await res.status(201).json({topic: createdReply});
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
});


router.put("/:replyID", async function (req, res, next) {
    try {
        const replyID = req.params.replyID;
        if (await Reply.findById(replyID)) {
            let fieldsToUpdate = {};
            const data = Object.keys(req.body);
            for (let key of data) {
                if (["reply"].includes(key)) {
                    fieldsToUpdate.key = data[key]
                }
            }
            fieldsToUpdate.date_modified = new Date();
            const updatedReply = await Reply.findByIdAndUpdate(topicID, fieldsToUpdate, {new: true});
            return await res.status(200).json({topic: updatedReply, message: "Reply updated"});
        } else {
            return res.status(404).json({error: "Reply not found"});
        }
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
});


router.delete("/:replyID", async function (req, res, next) {
    try {
        const replyID = req.params.replyID;
        if (Reply.findById(replyID)) {
            await Reply.findByIdAndDelete(replyID);
            return res.status(200).json({message: "Reply Deleted"});
        } else {
            return res.status(404).json({error: "Reply not found"});
        }
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
});

router.get("/:replyID", async function (req, res, next) {
    try {
        const replyID = req.params.replyID;
        if (Reply.findById(replyID)) {
            const reply = await Topic.findById(replyID);
            return res.status(200).json({reply: reply});
        } else {
            return res.status(404).json({error: "Reply not found"});
        }
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
});


router.put("/:replyID/like", async function (req, res, next) {
    try {
        const replyID = req.params.replyID;
        if(await Reply.findById(replyID)){
            const reply = await Reply.findById(replyID);
            let likes = topic.likes;
            if(!likes.includes(req.body.user)){
                likes.push(req.body.user);
                await topic.save();
                const updateReply = await Reply.findById(replyID);
                return res.status(200).json({topic: updateReply, message: "Reply updated"});
            }else {
                likes.pop(req.body.user);
                await reply.save();
                const updateReply = await Reply.findById(replyID);
                return res.status(200).json({topic: updateReply, message: "Reply updated"});
            }
        }else {
            return res.status(404).json({error: "Reply not found"});
        }
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
});

module.exports = router;

