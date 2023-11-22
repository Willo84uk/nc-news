const { getArticles, getArticlesById, patchArticleVotes } = require('../controllers/articles.controllers')
const { postNewComment, getCommentsByArticle } = require('../controllers/comments.controllers')

const articlesRouter = require('express').Router()

articlesRouter
.route('/')
.get(getArticles)

articlesRouter
.route("/:article_id")
.get(getArticlesById)
.patch(patchArticleVotes)

articlesRouter
.route("/:article_id/comments")
.get(getCommentsByArticle)
.post(postNewComment)

module.exports = articlesRouter