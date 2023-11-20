const { selectArticlesById } = require("../models/articles.models")

exports.getArticlesById = (req, res, next) => {
    const articleId = (req.params.article_id)
    selectArticlesById(articleId)
    .then(({rows}) => {
        res.status(200).send({article: rows[0]})
    })
    .catch((err) => { 
        next(err)
      })
}