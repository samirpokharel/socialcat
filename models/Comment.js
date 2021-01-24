const { Schema, model } = require("mongoose");
const joi = require("joi");
const { replaySchema } = require("./Replay");

const commentSchema = new Schema(
  {
    content: { type: String, required: true, maxlength: 1000 },
    user: { required: true, type: Schema.Types.ObjectId, ref: "User" },
    replays: [replaySchema],
  },
  { timestamps: true }
);

const Comment = model("Comment", commentSchema);

function validateComment(body) {
  const schema = joi.object({
    user: joi.string().required(),
    content: joi.string().required(),
  });
  return schema.validate(body);
}

module.exports = { Comment, validateComment, commentSchema };
