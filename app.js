const express = require("express")
const { getAllTopics, four0Four, getApi } = require("./controllers/topics.controllers")
const { handleCustomErrors, handleServerErrors } = require("./errors")

const app = express()

app.get("/api", getApi)

app.get("/api/topics", getAllTopics)

app.get("*", four0Four)

app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app