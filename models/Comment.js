const { Schema, model } = require("mongoose");
const joi = require("joi");

const commentSchema = new Schema(
  {
    content: { type: String, required: true, maxlength: 1000 },
    user: { required: true, type: Schema.Types.ObjectId, ref: "User" },
    post: { required: true, type: Schema.Types.ObjectId, ref: "Post" },
    replays: { type: [Schema.Types.ObjectId], ref: "Replay" },
  },
  { timestamps: true }
);

const Comment = model("Comment", commentSchema);

function validateComment(body) {
  const schema = joi.object({
    user: joi.string().required(),
    content: joi.string().required(),
    post: joi.string().required(),
  });
  return schema.validate(body);
}

module.exports = { Comment, validateComment };
