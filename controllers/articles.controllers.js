const { selectArticlesById, selectArticles, insertNewArticle, deleteArticle } = require("../models/articles.models")
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
    const {topic, sort_by, order, limit, p} = req.query
    const articlesPromises = [selectArticles(topic, sort_by, order, limit, p), selectTopics(topic) ]

    Promise.all(articlesPromises)
    .then((resolvedPromises) => {
        const articles = resolvedPromises[0].articles
        const count = resolvedPromises[0].count
        res.status(200).send({articles: articles, total_count: count})
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

exports.postNewArticle = (req, res, next) => {
    const { author, title, body, topic, article_img_url } = req.body
    insertNewArticle(author, title, body, topic, article_img_url)
    .then(({rows}) => {
        rows[0].comment_count = 0
        res.status(201).send({article: rows[0]})
    })
    .catch((err) => {
        next(err)
    })
}

exports.removeArticle = (req, res, next) => {
    const articleId = req.params.article_id
    deleteArticle(articleId)
    .then(() => {
        res.status(204).send()
    })
    .catch((err) => {
        next(err)
    })
}