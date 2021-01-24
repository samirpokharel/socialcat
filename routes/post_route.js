const { Router } = require("express");
const {
  getAllPosts,
  getPost,
  getAllUserFavoritePost,
  getAllUserPosts,
  createNewPost,
  updatePost,
  deletePost,
  createNewComment,
  deleteComment,
  createNewReplay,
  deleteReplay,
} = require("../controller/postController");
const auth = require("../middleware/auth");
const router = Router();

//uid = userId
//pid = postId

router.route("/").get(getAllPosts).post(createNewPost);
router.route("/:pid").get(getPost).put(updatePost).delete(deletePost);
router.route("/:uid").get(getAllUserPosts).get(getAllUserFavoritePost);
router.route("/:pid/comments").post(createNewComment);
router.route("/:pid/comments/:cid").delete(deleteComment);
router.route("/:pid/comments/:cid/replays").post(createNewReplay);
router.route("/:pid/comments/:cid/replays/:rid").post(deleteReplay);

module.exports = router;
