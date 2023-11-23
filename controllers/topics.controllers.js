const { selectTopics, insertNewTopic } = require("../models/topics.models")
const endpoints = require("../endpoints.json")

exports.getTopics = (req, res, next) => {
    return selectTopics()
    .then(({rows}) => {
        res.status(200).send({topics: rows})
    })
    .catch((err) => { 
        next(err)
      })
}

exports.postTopic = (req, res, next) => {
    const {slug, description} = req.body
    insertNewTopic(slug, description)
    .then(({rows}) => {
        res.status(201).send({topic: rows[0]})
    })
    .catch((err) => { 
        next(err)
      })
}

exports.getApi = (req, res, next) => {
    res.status(200).send({endpoints})
}