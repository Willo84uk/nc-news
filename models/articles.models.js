const db = require("../db/connection")
const { sort } = require("../db/data/test-data/articles")

exports.selectArticlesById = (articleId) => {
    return db.query(`
    SELECT articles.article_id, title, topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`, [articleId])
    .then(({rows}) => {
        if(!rows.length){
            return Promise.reject({status: 404, msg: "article not found with this article id"})
        }        
        return {rows}
    }) 
}

exports.selectArticles = (topic, sort_by = "created_at", order = "desc") => {
    const queryValues = []
    const validSortBy = ["article_id", "title", "topic", "author", "created_at", "votes", "article_img_url", "comment_count"]
    const validOrder = ["desc", "asc"]
    if(!validSortBy.includes(sort_by) || !validOrder.includes(order)){
        return Promise.reject({status: 400, msg: "bad request"})
    }

    let queryStr = `
    SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id ` 
    
    if(topic){
        queryValues.push(topic)
        queryStr += `WHERE topic = $1 `
    }
    
    queryStr += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`
    
    return db.query(queryStr, queryValues)
   
    .then(({rows}) => { 
        return {rows}
    })
}

exports.updateArticleVotes = (voteAdjustment, articleId) => {
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [voteAdjustment, articleId])
    .then(({rows}) => {
        if(!rows.length){
            return Promise.reject({status: 404, msg: "article not found with this article id"})
        }        
        return {rows}
    }) 
}