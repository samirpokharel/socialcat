const asyncMiddleware = require("../middleware/async");
const { errorResponse } = require("../utils/response");
const { Post, validatePost } = require("../models/Post");
const { Comment, validateComment } = require("../models/Comment");
const { Replay, validateReplay } = require("../models/Replay");

// ============== GET +====================
//@ GET All Posts
module.exports.getAllPosts = asyncMiddleware(async (req, res) => {
  const posts = await Post.find()
    .populate("user", "email _id")
    .populate("comments.user", "email _id")
    .populate("comments.replays.user", "email _id")
    .sort("-createdAt");
  res.send({
    sucess: true,
    count: posts.length,
    data: posts,
  });
});

//@ GET  Post with id
module.exports.getPost = asyncMiddleware(async (req, res) => {
  const post = await Post.findById(req.params.pid);
  if (!post)
    return res
      .status(404)
      .send(errorResponse(Error("No post found wit given id")));
  res.send(post);
});

//@ GET All User Post
module.exports.getAllUserPosts = asyncMiddleware(async (req, res) => {
  const posts = await Post.find({ user: req.params.uid });
  res.send(posts);
});

//@ GET All User favorite Post
module.exports.getAllUserFavoritePost = asyncMiddleware((req, res) => {
  res.send("Get All post");
});

// ============== POST +====================

//@ POST create new post
module.exports.createNewPost = asyncMiddleware(async (req, res) => {
  const { error } = validatePost(req.body);
  if (error) return res.status(400).send(errorResponse(error));
  const post = await Post.create(req.body);
  res.send(post);
});

// ============== PUT +====================

//@ PUT update post
module.exports.updatePost = asyncMiddleware(async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.pid, req.body, {
    new: true,
    runValidators: true,
  });
  if (!post)
    return res
      .status(400)
      .send(errorResponse(Error("No post found wit given id")));
  res.send(post);
});

// ============== DELETE +====================

//@ DELETE delete post
module.exports.deletePost = asyncMiddleware(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.pid, req.body);
  if (!post)
    return res
      .status(400)
      .send(errorResponse(Error("No post found wit given id")));
  res.send(post);
});
// <<<<<<<<<<<<<<<<<<< comment >>>>>>>>>>>>>>>>>>>>>>

module.exports.createNewComment = asyncMiddleware(async (req, res) => {
  const { error } = validateComment(req.body);
  if (error) return res.status(400).send(errorResponse(error));
  const comment = await new Comment(req.body);
  const post = await Post.findById(req.params.pid);
  post.comments.push(comment);
  await post.save();
  res.send("Comment added sucessfully");
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

module.exports.deleteComment = asyncMiddleware(async (req, res) => {
  const post = await Post.findById(req.params.pid);
  const comment = post.comments.id(req.params.cid);
  comment.remove();
  await post.save();
  res.send("Comment Removed sucessfully");
});

//<<<<<<<<<<<<<<<<<<<< Rplaya >>>>>>>>>>>>>>>>>>>>>>>>>

module.exports.createNewReplay = asyncMiddleware(async (req, res) => {
  const { error } = validateReplay(req.body);
  if (error) return res.status(400).send(errorResponse(error));
  const replay = await new Replay(req.body);
  const post = await Post.findById(req.params.pid);
  post.comments.id(req.params.cid).replays.push(replay);
  await post.save();
  res.send("Replay added sucessfully");
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

module.exports.deleteReplay = asyncMiddleware(async (req, res) => {
  const post = await Post.findById(req.params.pid);
  const replay = post.comments.id(req.params.cid).replays.id(rid);
  replay.remove();
  await post.save();
  res.send("Comment Removed sucessfully");
});
