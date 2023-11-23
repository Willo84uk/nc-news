const db = require("../db/connection")

exports.updateVotes = (voteAdjustment, articleId, commentId) => {
    let tableToUpdate
    let idToUpdate
    let queryColumn

    if(articleId){tableToUpdate = "articles", idToUpdate = articleId, queryColumn = "article_id"}
    if(commentId){tableToUpdate = "comments", idToUpdate = commentId, queryColumn = "comment_id"}

    return db.query(`UPDATE ${tableToUpdate} SET votes = votes + $1 WHERE ${queryColumn} = $2 RETURNING *`, [voteAdjustment, idToUpdate])
    .then(({rows}) => {
        if(!rows.length){
            return Promise.reject({status: 404, msg: "item not found with specified id"})
        }        
        return {rows}
    }) 
}