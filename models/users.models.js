const db = require("../db/connection")

exports.selectUsers = (username) => {
    let queryStr = `SELECT username, name, avatar_url FROM users `
    const queryValue = []
    
    if(username){
        queryStr += `WHERE username = $1`
        queryValue.push(username)
    }
    return db.query(queryStr, queryValue)
    .then(({rows}) => {
        if(!rows.length){
            return Promise.reject({status: 404, msg: "user not found with this username"})
        }        
        return {rows}
    })
}