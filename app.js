const express = require("express")
const { getAllTopics, four0Four, getApi } = require("./controllers/topics.controllers")
const { handleCustomErrors, handleServerErrors, handlePsqlErrors } = require("./errors")
const { getArticlesById, getArticles } = require("./controllers/articles.controllers")

const app = express()

app.get("/api", getApi)

app.get("/api/topics", getAllTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticlesById)

app.get("*", four0Four)

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app