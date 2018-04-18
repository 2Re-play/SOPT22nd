const http = require('http');
const request = require('request');
const fs = require('fs');
const json2csv = require('json2csv');
const Converter = require('csvtojson').Converter;

const server = http.createServer(function(req, res) {
    let option = {
        uri: 'http://13.125.118.111:3000/homework/2nd',
        method: 'GET' //method 가 없으면 404로 뜨고, 다른 방식으로 접근할 경우에도 404 뜸!
    };
    request(option, function(err, response, body) {
        if (req.url === '/favicon.ico'){
        return;
        }
        if (err) {
            console.log("Request module error : " + err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Request module error!");
        } else {
            let bodyParsed = JSON.parse(body);
            const field = ['time'];
            let object = json2csv.parse(bodyParsed, { field });
            fs.writeFile('./time.csv', object, function(err) {
                if (err) {
                    console.log("write csv error : " + err);
                } else {
                    console.log("successful write csv");
                }
            });
            let converter = new Converter({});
            let data = [];
            converter.fromFile('./time.csv', function(err, result) {
                if (err) {
                    console.log("read csv file error : " + err);
                } else {
                    console.log("successful read csv file");
                    console.log(result);
                    data = result;
                    res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
                    res.end(JSON.stringify({
                        msg: "success",
                        data: data
                    }));
                }
            })
        }
    });
}).listen(3000, function() {
    console.log('connected 3000 port!!');
});