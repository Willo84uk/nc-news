const db = require("../db/connection")

exports.selectArticlesById = (articleId) => {
    return db.query(`
    SELECT * 
    FROM articles WHERE article_id = $1`, [articleId])
    .then(({rows}) => {
        if(!rows.length){
            return Promise.reject({status: 404, msg: "article not found with this article id"})
        }        
        return {rows}
    }) 
}

exports.selectArticles = () => {
    return db.query(`
    SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC`)
    .then(({rows}) => {    
        return {rows}
    })
}