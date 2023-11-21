const { insertNewComment } = require("../models/comments.models")

exports.postNewComment = (req, res, next) => {
    const {username, body} = req.body
    const articleId = req.params.article_id
    if(!username || !body || !articleId){
        return Promise.reject({status: 400, msg: "bad request"})
        .catch((err) => {
            next(err)
        })
    } else {
    insertNewComment (username, body, articleId)
    .then(({rows}) => {
        res.status(201).send({comment: rows[0]})
    })
    .catch((err) => {
        next(err)
    })
}
}