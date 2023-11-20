const { selectAllTopics } = require("../models/topics.models")

exports.four0Four = (req, res) => {
    res.status(404).send({msg: "path not found"})
}

exports.getAllTopics = (req, res, next) => {
    return selectAllTopics()
    .then(({rows}) => {
        res.status(200).send({topics: rows})
    })
    .catch((err) => { 
        next(err)
      })
}