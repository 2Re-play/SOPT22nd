const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const upload = require('../config/multer.js');
const pool = require('../config/dbPool.js');


router.get(('/'), function(req,res){
    pool.getConnection(function(err, connection){
        if(err){
            res.status(500).send({
                message : "Internal Server Error"
            });
            connection.release();
        } else{
            let sql = "SELECT DISTINCT category FROM store";
            connection.query(sql, function(err, result){
            if(err){
                res.status(500).send({
                    message : "main data get error"
                });
                connection.release();
                console.log("Internal Server Error");
            } else {
                console.log(result)
                res.status(200).send({
                    data : result,
                });
                connection.release();
                console.log("Successfully get main Data");
                 }
            });
        };
    });
});
module.exports = router;
