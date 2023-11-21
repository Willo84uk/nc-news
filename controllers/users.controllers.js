const db = require("../db/connection")
const { selectAllUsers } = require("../models/users.models")

exports.getAllUsers = (req, res, next) => {
    selectAllUsers()
    .then(({rows}) => {
        res.status(200).send({users: rows})
    })
    .catch((err) => {
        next(err)
    })
}