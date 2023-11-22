const { selectTopics } = require("../models/topics.models")
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

exports.getApi = (req, res, next) => {
    res.status(200).send({endpoints})
}