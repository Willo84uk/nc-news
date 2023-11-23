const { getArticles, getArticlesById, patchArticleVotes, postNewArticle, removeArticle } = require('../controllers/articles.controllers')
const { postNewComment, getCommentsByArticle } = require('../controllers/comments.controllers')

const articlesRouter = require('express').Router()

articlesRouter
.route('/')
.get(getArticles)
.post(postNewArticle)

articlesRouter
.route("/:article_id")
.get(getArticlesById)
.patch(patchArticleVotes)
.delete(removeArticle)

articlesRouter
.route("/:article_id/comments")
.get(getCommentsByArticle)
.post(postNewComment)

module.exports = articlesRouter