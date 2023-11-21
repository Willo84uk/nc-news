const db = require("../db/connection")

exports.selectAllUsers = () => {
    return db.query(`SELECT username, name, avatar_url FROM users`)
}