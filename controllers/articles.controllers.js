const { selectArticlesById, selectArticles, updateArticleVotes } = require("../models/articles.models")

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

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then(({rows}) => {
        res.status(200).send({articles: rows})
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchArticleVotes = (req, res, next) => {
    const articleId = req.params.article_id
    const voteAdjustment = req.body.inc_votes
    updateArticleVotes(voteAdjustment, articleId)
    .then(({rows}) => {
        res.status(200).send({article: rows[0]})
    })
    .catch((err) => {
        next(err)
    })
}