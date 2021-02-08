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

router.route("/").get(auth, getAllPosts).post(auth, createNewPost);
router
  .route("/:pid")
  .get(auth, getPost)
  .put(auth, updatePost)
  .delete(auth, deletePost);
router
  .route("/:uid")
  .get(auth, getAllUserPosts)
  .get(auth, getAllUserFavoritePost);
router.route("/:pid/comments").post(auth, createNewComment);
router.route("/:pid/comments/:cid").delete(auth, deleteComment);
router.route("/:pid/comments/:cid/replays").post(auth, createNewReplay);
router.route("/:pid/comments/:cid/replays/:rid").post(auth, deleteReplay);

module.exports = router;
