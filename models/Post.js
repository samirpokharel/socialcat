const { Schema, model } = require("mongoose");
const { commentSchema } = require("./Comment");
const joi = require("joi");

const postSchema = new Schema(
  {
    content: { type: String, required: true, maxlength: 1000 },
    user: { required: true, type: Schema.Types.ObjectId, ref: "User" },
    comments: [commentSchema],
  },
  { timestamps: true }
);

function validatePost(body) {
  const schema = joi.object({
    user: joi.string().required(),
    content: joi.string().required(),
  });
  return schema.validate(body);
}
const Post = model("Post", postSchema);

module.exports = { Post, validatePost };
