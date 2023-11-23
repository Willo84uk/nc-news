const { selectArticlesById, selectArticles, updateArticleVotes } = require("../models/articles.models")
const { selectTopics } = require("../models/topics.models")
const { updateVotes } = require("../models/votes.models")

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
    const {topic, sort_by, order} = req.query
    const articlesPromises = [selectArticles(topic, sort_by, order), selectTopics(topic) ]

    Promise.all(articlesPromises)
    .then((resolvedPromises) => {
        const articles = resolvedPromises[0].rows
        res.status(200).send({articles: articles})
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchArticleVotes = (req, res, next) => {
    const articleId = req.params.article_id
    const voteAdjustment = req.body.inc_votes
    updateVotes(voteAdjustment, articleId)
    .then(({rows}) => {
        res.status(200).send({article: rows[0]})
    })
    .catch((err) => {
        next(err)
    })
}