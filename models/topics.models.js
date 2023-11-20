const db = require("../db/connection")

exports.selectAllTopics = () => {
    return db.query(`
    SELECT * FROM topics;`)
    .then(({rows}) => {
        if(!rows.length){
            return Promise.reject({status: 404, msg: "no topics exist"})
        }        
        return {rows}
    })
}