const { selectArticlesById } = require("../models/articles.models")
const { selectCommentsByArticle } = require("../models/comments.models")

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