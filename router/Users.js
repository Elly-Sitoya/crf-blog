const express = require("express");
const router = express.Router();
const Users = require("../models/user.js");
const mongoose = require("mongoose");
// const user = require('../models/user.js');
var ObjectId = mongoose.Types.ObjectId;
router.get("/getuser", async (req, res) => {
  try {
    const users = await Users.find({});
    res.json({ users: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});
router.get("/userById/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.patch("/updateUser/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update user" });
  }
});
router.delete("/deleteUser/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: "deleted" });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});
router.patch("/:id/follow", async (req, res) => {
  // console.log(req.body)

  if (req.body.userId !== req.params.id) {
    try {
      const user = await Users.findById(req.params.id);
      const currentUser = await Users.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.json({ message: "Success" });
      } else {
        res.json({ message: "You already follow" });
      }
    } catch (error) {
      res.send(error);
    }
  } else {
    res.send("You can follow yourself");
  }
});
router.patch("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await Users.findById(req.params.id);
      const currentUser = await Users.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.json({ message: "Success" });
      } else {
        res.json({ message: "You Dont follow this user" });
      }
    } catch (error) {
      res.send(error);
    }
  } else {
    res.send("You can follow yourself");
  }
});
router.get("/:id/followers", async (req, res) => {
  const { id } = req.params;
  let followers = [];

  const user = await Users.findOne({ _id: id });
  if (!user) {
    res.json({ message: "Invalid User ID" });
  } else {
    user.followers.map((e) => followers.push(e));
    res.json({ followers: followers });
  }
});
router.get("/:id/followings", async (req, res) => {
  const { id } = req.params;
  let followings = [];
  const user = await Users.findOne({ _id: id });
  if (!user) {
    res.json({ message: "Invalid User ID" });
  } else {
    user.followings.map((e) => followings.push(e));
    res.json({ followings: followings });
  }
});

router.get("/userscount", async (req, res) => {
  try {
    const count = await Users.countDocuments({});
    res.json({ count: count });
  } catch (error) {
    res.status(500).json({ error: "Failed to get user count" });
  }
});

router.get("/search/author?", async (req, res) => {
  const { q } = req.query;
  await Users.find({ username: { $regex: q, $options: "$i" } })
    .then((data) => res.json(data))
    .catch((error) => res.json(error));
});

module.exports = router;
