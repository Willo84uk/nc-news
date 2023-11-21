const { selectArticlesById } = require("../models/articles.models")
const { selectCommentsByArticle, deleteCommentFromDb } = require("../models/comments.models")

exports.getCommentsByArticle = (req, res, next) => {
    const articleId = req.params.article_id
    const commentsPromises = [selectCommentsByArticle(articleId), selectArticlesById(articleId)]
    
    Promise.all(commentsPromises)
    .then((resolvedPromises) => {
        const comments = resolvedPromises[0].rows
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