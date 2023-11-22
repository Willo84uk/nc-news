const { query } = require("express")
const db = require("../db/connection")

exports.selectTopics = (topic) => {
    const queryValues = []
    let queryStr = `SELECT * FROM topics `
    
    if(topic){
        queryValues.push(topic)
        queryStr += `WHERE slug = $1 `
    }
    
    return db.query(queryStr, queryValues)
    .then(({rows}) => {
        if(!rows.length){
            return Promise.reject({status: 404, msg: "topic(s) not found"})
        }        
        return {rows}
    })
}