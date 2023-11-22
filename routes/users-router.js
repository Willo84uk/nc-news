const { getAllUsers } = require('../controllers/users.controllers')

const usersRouter = require('express').Router()

usersRouter.get("/", getAllUsers)

module.exports = usersRouter