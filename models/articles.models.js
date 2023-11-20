const db = require("../db/connection")

exports.selectArticlesById = (articleId) => {
    return db.query(`
    SELECT * 
    FROM articles WHERE article_id = $1`, [articleId])
    .then(({rows}) => {
        if(!rows.length){
            return Promise.reject({status: 404, msg: "topic not found with this article id"})
        }        
        return {rows}
    }) 
}