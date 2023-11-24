const endpoints = require("../endpoints.json")

exports.four0Four = (req, res) => {
    res.status(404).send({msg: "path not found"})
}

exports.getApi = (req, res, next) => {
    res.status(200).send({endpoints})
}