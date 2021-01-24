const { Schema, model } = require("mongoose");
const joi = require("joi");

const replaySchema = new Schema(
  {
    content: { type: String, required: true, maxlength: 1000 },
    user: { required: true, type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

function validateReplay(body) {
  const schema = joi.object({
    user: joi.string().required(),
    content: joi.string().required(),
  });
  return schema.validate(body);
}

const Replay = model("Replay", replaySchema);

module.exports = { Replay, validateReplay, replaySchema };
