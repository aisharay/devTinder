import express from "express";
import dotenv from "dotenv";
import { userAuth } from "../middlewares/auth.js";
import ConnectionRequest from "../models/connections.js";
import User from "../models/user.js";

dotenv.config();

const userRoute = express.Router();
const USER_SAFE_DETAILS = process.env.USER_SAFE_DETAILS.split(',');

userRoute.get("/feed", userAuth, async (req, res) => {
    try {
        const user = req.user
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit = limit > 100 ? 100 : limit

        const skip = (page - 1) * limit
        
        const requests = await ConnectionRequest.find({
            $or: [
                { fromUserId: user._id },
                { toUserId: user._id }
            ]
        }).select(["fromUserId", "toUserId"])

        const excludedUserIds = new Set([])
        requests.forEach(request => {
            excludedUserIds.add(request.fromUserId.toString())
            excludedUserIds.add(request.toUserId.toString())
        })

        const feedUsers = await User.find({
            $and: [
                { _id: { $nin: Array.from(excludedUserIds) } },
                { _id: { $ne: user._id } }
            ]
           
        })
        .select(USER_SAFE_DETAILS)
        .skip(skip)
        .limit(limit)

        res.send(feedUsers)
    }
    catch(err) {
        res.status(400).json({message: err.message})
    }
})

export default userRoute;