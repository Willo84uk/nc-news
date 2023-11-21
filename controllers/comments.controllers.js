const { insertNewComment } = require("../models/comments.models")

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
