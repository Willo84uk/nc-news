const express = require("express")
const { getApi } = require("./controllers/topics.controllers")
const { handleCustomErrors, handleServerErrors, handlePsqlErrors } = require("./errors")
const { four0Four } = require("./controllers/api.controllers")
const usersRouter = require("./routes/users-router")
const topicsRouter = require("./routes/topics.router")
const articlesRouter = require("./routes/articles.router")
const commentsRouter = require("./routes/comments.router")

const app = express()
app.use(express.json());

app.get("/api", getApi)

app.use('/api/users', usersRouter)
app.use('/api/topics', topicsRouter)
app.use('/api/articles', articlesRouter)
app.use('/api/comments', commentsRouter)

app.get("*", four0Four)

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app