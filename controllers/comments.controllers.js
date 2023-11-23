const { insertNewComment } = require("../models/comments.models")
const { selectArticlesById } = require("../models/articles.models")
const { selectCommentsByArticle, deleteCommentFromDb } = require("../models/comments.models")
const { updateVotes } = require("../models/votes.models")

exports.postNewComment = (req, res, next) => {
    const {username, body} = req.body
    const articleId = req.params.article_id
    insertNewComment (username, body, articleId)
    .then(({rows}) => {
        res.status(201).send({comment: rows[0]})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getCommentsByArticle = (req, res, next) => {
    const articleId = req.params.article_id
    const {limit, p} = req.query
    const commentsPromises = [selectCommentsByArticle(articleId, limit, p), selectArticlesById(articleId)]
    
    Promise.all(commentsPromises)
    .then((resolvedPromises) => {
        const comments = resolvedPromises[0]
        res.status(200).send({comments})
    })
    .catch((err) => {
        next(err)
    })
}

exports.deleteComment = (req, res, next) => {
    const commentId = req.params.comment_id
    deleteCommentFromDb(commentId)
    .then(() => {
        res.status(204).send()
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchCommentVotes = (req, res, next) => {
    const commentId = req.params.comment_id
    const voteAdjustment = req.body.inc_votes
    updateVotes(voteAdjustment, undefined, commentId)
    .then(({rows}) => {
        res.status(200).send({comment: rows[0]})
    })
    .catch((err) => {
        next(err)
    })
}