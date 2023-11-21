const db = require("../db/connection")

exports.insertNewComment = (username, body, articleId) => {
    return db.query(`INSERT INTO comments (author, article_id, body)VALUES ($1, $2, $3) 
     RETURNING *`, [username, articleId, body])
}