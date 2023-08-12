const express = require("express");
const viewPosts = require("../controllers/postController/viewPosts");
const viewPost = require("../controllers/postController/viewPost");
const viewComments = require("../controllers/postController/viewComments");
const createPost = require("../controllers/postController/createPost");
const checkPostAuthorization = require("../controllers/postController/checkPostAuthorization");
const editPost = require("../controllers/postController/editPost");
const deletePost = require("../controllers/postController/deletePost");
const createComment = require("../controllers/postController/createComment");
const checkCommentAuthorization = require("../controllers/postController/checkCommentAuthorization");
const deleteComment = require("../controllers/postController/deleteComment");
const editComment = require("../controllers/postController/editComment");
const postRouter = express.Router();

postRouter.get("/", viewPosts);
postRouter.get("/:postId", viewPost);
postRouter.get("/:postId/comments", viewComments);

// protected
postRouter.post("/create", createPost);
postRouter.get("/:postId/edit/authorization", checkPostAuthorization);
postRouter.put("/:postId/edit", editPost);
postRouter.delete("/:postId/delete", deletePost);
postRouter.post("/:postId/comments", createComment);
postRouter.get("/:postId/comments/:commentId/authorization", checkCommentAuthorization);
postRouter.put("/:postId/comments/:commentId", editComment);
postRouter.delete("/:postId/comments/:commentId", deleteComment);

module.exports = postRouter;
