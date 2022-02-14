const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    // authorized: {
    //   type: Boolean,
    //   required: false,
    // },
    // userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  }
);

module.exports = mongoose.model("Post", PostSchema);
