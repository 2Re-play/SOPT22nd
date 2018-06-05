const express = require('express');
const pool = require('../config/dbPool.js');
const router = express.Router();

//북마크 post
router.post('/', function(req, res) {
    let user_idx = req.body.user_idx;
    let store_idx =  req.body.store_idx;
    pool.getConnection(function(err,connection){
        if(err){
            res.status(500).send({
                message :  "Internal Server Error"
            })
        } else{
            if(!user_idx&&!store_idx){ //user_idx, store_idx 체크
                res.status(500).send({
                    message : "user_idx, store_idx error"
                });
                connection.release();
                console.log("user_idx, store_idx error");
            } else {
                let sql = "INSERT INTO bookmark(user_user_idx, store_store_idx) VALUES (?,?)";
                connection.query(sql,[user_idx, store_idx], function (err, result) {
                    if (err){
                        res.status(500).send({
                            message : "Bookmark parameter INSERT ERROR"
                        });
                        connection.release();
                        console.log("Bookmark parameter INSERT ERROR");
                    } else{
                        res.status(201).send({
                            message : "Successfully INSERT Bookmark Data"
                        });
                        connection.release();
                        console.log("Successfully INSERT Bookmark Data");
                    };
                });
            }
        }
    })
});
//북마크 보기
router.get('/:user_idx/:store_idx', function(req, res){
    let user_idx = req.params.user_idx;
    let store_idx = req.params.store_idx;
    pool.getConnection(function(err, connection){
        if(err){
            res.status(500).send({
                message :  "Internal Server Error"
            })
        }else {
            if(!user_idx &&!store_idx){
                res.status(404).send({
                    messgae : "user_idx, store_idx Does not exist."
                });
                connection.release();
                console.log("user_idx, store_idx Does not exist.")
            }else {
                let sql = "SELECT DISTINCT store_name, menu_name,(SELECT count(*) FROM review WHERE store_idx = ?) as review_count "+
                "FROM menu JOIN( bookmark JOIN store USING(store_idx)) USING(store_idx) "+
                "WHERE bookmark.store_idx =? AND bookmark.user_idx =?";
      connection.query(sql,[store_idx, store_idx, user_idx], function(err, result){
            if (err){
                res.status(500).send({
                    message : "Bookmark parameter GET ERROR"
                });
                connection.release();
                console.log("Bookmark parameter GET ERROR");
                } else{
                res.status(200).send({
                message :"Successfully GET Bookmark Data",
                    data : result
                });
                connection.release();	
                console.log("Successfully GET Bookmark Data");
                    }
                })
            }
        }
    })
})
module.exports = router;
