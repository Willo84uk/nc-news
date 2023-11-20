const express = require("express")
const { getAllTopics, four0Four } = require("./controllers/topics.controllers")
const { handleCustomErrors, handleServerErrors } = require("./errors")

const app = express()

app.use(express.json())

app.get("/api/topics", getAllTopics)

app.get("*", four0Four)

app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app