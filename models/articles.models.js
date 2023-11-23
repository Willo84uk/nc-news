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

exports.selectArticles = (topic, sort_by = "created_at", order = "desc", limit = 10, p = 1) => {
    const queryValues = []
    const validSortBy = ["article_id", "title", "topic", "author", "created_at", "votes", "article_img_url", "comment_count"]
    const validOrder = ["desc", "asc"]
    const validLimit = /^\d+$/.test(limit)
    const validPage = /^\d+$/.test(p)
    const offset = (p-1)*limit
    if(!validSortBy.includes(sort_by) || !validOrder.includes(order) || !validPage || !validLimit){
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
    
    queryStr += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order} ` 

    return outputCount = db.query(queryStr, queryValues).then(({rows}) => {
        return rows.length
    }).then((outputCount) =>{

        queryStr += `LIMIT ${limit} OFFSET ${offset};`

        const articles = db.query(queryStr, queryValues)
        return articles
        .then(({rows}) => {
            if(p>Math.ceil(outputCount/limit) && p>1){
                return Promise.reject({status: 400, msg: "page out of range"})
            }
            return {articles: rows, count: outputCount}
        })
    })
}

exports.insertNewArticle = (author, title, body, topic, imgUrl) => {
    let columnsToInsert = "author, title, body, topic"
    let numberOfValuesToInsert = "$1, $2, $3, $4"
    const valuesToInsert = [author, title, body, topic]

    if(imgUrl) {columnsToInsert += ", article_img_url", numberOfValuesToInsert += ", $5", valuesToInsert.push(imgUrl)}  
    
    return db.query(`
    INSERT INTO articles (${columnsToInsert}) 
    VALUES (${numberOfValuesToInsert}) RETURNING *`, 
    valuesToInsert)
}