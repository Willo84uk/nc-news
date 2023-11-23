const { selectUsers } = require("../models/users.models")

exports.getAllUsers = (req, res, next) => {
    selectUsers()
    .then(({rows}) => {
        res.status(200).send({users: rows})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getUserByUsername = (req, res, next) => {
    const {username} = req.params
    selectUsers(username)
    .then(({rows}) => {
        res.status(200).send({user: rows[0]})
    })
    .catch((err) => {
        next(err)
    })
}