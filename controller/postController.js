const asyncMiddleware = require("../middleware/async");
const { errorResponse } = require("../utils/response");
const { Post, validatePost } = require("../models/Post");
const { Comment, validateComment } = require("../models/Comment");
const { Replay, validateReplay } = require("../models/Replay");
const { User } = require("../models/User");

function sucessResponse(data) {
  return {
    sucess: true,
    count: data.length,
    data,
  };
}

// ============== GET +====================
//@ GET All Posts
module.exports.getAllPosts = asyncMiddleware(async (req, res) => {
  const pageNumber = Number(req.query.pageNumber);
  const pageSize = Number(req.query.pageSize);
  const posts = await Post.find()
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .populate("user", "email _id")
    .populate("comments.user", "email _id")
    .populate("comments.replays.user", "email _id")
    .sort("-createdAt");
  res.send(sucessResponse(posts));
});

//@ GET  Post with id
module.exports.getPost = asyncMiddleware(async (req, res) => {
  const post = await Post.findById(req.params.pid)
    .populate("user", "email _id")
    .populate("comments.user", "email _id")
    .populate("comments.replays.user", "email _id")
    .sort("-createdAt");
  if (!post)
    return res
      .status(404)
      .send(errorResponse(Error("No post found wit given id")));
  res.send(sucessResponse(post));
});

//@ GET All User Post
module.exports.getAllUserPosts = asyncMiddleware(async (req, res) => {
  const user = await User.findById(req.params.uid);
  if (!user)
    return res
      .status(404)
      .send(errorResponse(Error("No User found with given id")));
  const posts = await Post.find({ user: req.params.uid })
    .populate("user", "email _id")
    .populate("comments.user", "email _id")
    .populate("comments.replays.user", "email _id")
    .sort("-createdAt");
  res.send(sucessResponse(posts));
});

//@ GET All User favorite Post
module.exports.getAllUserFavoritePost = asyncMiddleware(async (req, res) => {
  const user = await User.findById(req.params.user);
  if (!user)
    return res
      .status(404)
      .send(errorResponse(Error("No User found with given id")));
  const post = await Post.find({ user: req.params.uid })
    .populate("user", "email _id")
    .populate("comments.user", "email _id")
    .populate("comments.replays.user", "email _id")
    .sort("-createdAt");
  res.send(sucessResponse(post));
});

// ============== POST +====================

//@ POST create new post
module.exports.createNewPost = asyncMiddleware(async (req, res) => {
  const { error } = validatePost(req.body);
  if (error) return res.status(400).send(errorResponse(error));
  const user = await User.findById(req.body.user);
  if (!user)
    return res
      .status(404)
      .send(errorResponse(Error("No User found with given id")));
  const post = await Post.create(req.body);
  res.send(sucessResponse(post));
});

// ============== PUT +====================

//@ PUT update post
module.exports.updatePost = asyncMiddleware(async (req, res) => {
  const user = await User.findById(req.params.user);
  if (!user)
    return res
      .status(404)
      .send(errorResponse(Error("No User found with given id")));
  const post = await Post.findByIdAndUpdate(req.params.pid, req.body, {
    new: true,
    runValidators: true,
  })
    .populate("user", "email _id")
    .populate("comments.user", "email _id")
    .populate("comments.replays.user", "email _id")
    .sort("-createdAt");
  if (!post)
    return res
      .status(400)
      .send(errorResponse(Error("No post found wit given id")));
  res.send(sucessResponse(post));
});

// ============== DELETE +====================

//@ DELETE delete post
module.exports.deletePost = asyncMiddleware(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.pid, req.body)
    .populate("user", "email _id")
    .populate("comments.user", "email _id")
    .populate("comments.replays.user", "email _id")
    .sort("-createdAt");
  if (!post)
    return res
      .status(400)
      .send(errorResponse(Error("No post found wit given id")));
  res.send(sucessResponse(post));
});
// <<<<<<<<<<<<<<<<<<< comment >>>>>>>>>>>>>>>>>>>>>>

module.exports.createNewComment = asyncMiddleware(async (req, res) => {
  const user = await User.findById(req.body.user);
  if (!user)
    return res
      .status(404)
      .send(errorResponse(Error("No User found with given id")));
  const { error } = validateComment(req.body);
  if (error) return res.status(400).send(errorResponse(error));
  const comment = await new Comment(req.body);
  const post = await Post.findById(req.params.pid);
  post.comments.push(comment);
  await post.save();
  res.send("Comment added sucessfully");
});

module.exports.deleteComment = asyncMiddleware(async (req, res) => {
  const post = await Post.findById(req.params.pid);
  const comment = post.comments.id(req.params.cid);
  comment.remove();
  await post.save();
  res.send("Comment Removed sucessfully");
});

// module.exports.updateComment = asyncMiddleware(async (req, res) => {
//   const post = await Post.findByIdAndUpdate(
//     req.params.pid,
//     {
//       $push: { comments: req.body },
//     },
//     { new: true, upsert: true }
//   );
//   post.comments.push(comment);
//   await post.save();
//   res.send("Comment added sucessfully");
// });
//<<<<<<<<<<<<<<<<<<<< Rplaya >>>>>>>>>>>>>>>>>>>>>>>>>

module.exports.createNewReplay = asyncMiddleware(async (req, res) => {
  const user = await User.findById(req.body.user);
  if (!user)
    return res
      .status(404)
      .send(errorResponse(Error("No User found with given id")));
  const { error } = validateReplay(req.body);
  if (error) return res.status(400).send(errorResponse(error));
  const replay = await new Replay(req.body);
  const post = await Post.findById(req.params.pid);
  post.comments.id(req.params.cid).replays.push(replay);
  await post.save();
  res.send("Replay added sucessfully");
});

module.exports.deleteReplay = asyncMiddleware(async (req, res) => {
  const post = await Post.findById(req.params.pid);
  const replay = post.comments.id(req.params.cid).replays.id(rid);
  replay.remove();
  await post.save();
  res.send("Comment Removed sucessfully");
});

// module.exports.updateComment = asyncMiddleware(async (req, res) => {
//   const post = await Post.findByIdAndUpdate(
//     req.params.pid,
//     {
//       $push: { comments: req.body },
//     },
//     { new: true, upsert: true }
//   );
//   post.comments.push(comment);
//   await post.save();
//   res.send("Comment added sucessfully");
// });
