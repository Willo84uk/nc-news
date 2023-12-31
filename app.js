const express = require("express")
const { handleCustomErrors, handleServerErrors, handlePsqlErrors } = require("./errors")
const { four0Four, getApi } = require("./controllers/api.controllers")
const usersRouter = require("./routes/users-router")
const topicsRouter = require("./routes/topics.router")
const articlesRouter = require("./routes/articles.router")
const commentsRouter = require("./routes/comments.router")
const cors = require('cors')

const app = express()

app.use(cors())
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