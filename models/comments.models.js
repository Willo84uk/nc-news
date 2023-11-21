const { use } = require("../app")
const db = require("../db/connection")

exports.insertNewComment = (username, body, articleId) => {
    if(!username || !body || !articleId){
        return Promise.reject({status: 400, msg: "bad request"})
    } else {
    return db.query(`INSERT INTO comments (author, article_id, body)VALUES ($1, $2, $3) 
     RETURNING *`, [username, articleId, body])
    }
}

exports.selectCommentsByArticle = (articleId) => {
    return db.query (`
    SELECT *
    FROM comments
    WHERE article_id = $1 ORDER BY created_at DESC`, [articleId])
    .then(({rows}) => {
        return {rows}
    })
    
}