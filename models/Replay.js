const { Schema, model } = require("mongoose");

const replaySchema = new Schema(
  {
    content: { type: String, required: true, maxlength: 1000 },
    user: { required: true, type: Schema.Types.ObjectId, ref: "User" },
    comment: { required: true, type: Schema.Types.ObjectId, ref: "Comment" },
  },
  { timestamps: true }
);

function validateReplay(body) {
  const schema = joi.object({
    user: joi.string().required(),
    content: joi.string().required(),
    comment: joi.string().required(),
  });
  return schema.validate(body);
}

const Replay = model("Replay", replaySchema);

module.exports = { Replay, validateReplay };
