const http = require('http');
const request = require('request');
const fs = require('fs');
const json2csv = require('json2csv');
const Converter = require('csvtojson').Converter;
const crypto = require('crypto');


const server = http.createServer(function(req, res) {
    if (req.url === '/favicon.ico'){
        return;
        }
    let option = {
        uri: 'http://13.125.118.111:3000/homework/2nd',
        method: 'POST',
        form: {
            name: //이름,
            phone: //핸드폰번호
        } 
    };
    request(option, function(err, response, body) {
        if (err) {
            console.log("Request module error : " + err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Request module error!");
        } else {
            let bodyParsed = JSON.parse(body);

            crypto.randomBytes(32, function(err, buffer) {
                if (err) {
                    console.log(err);
                } else {
                    crypto.pbkdf2(bodyParsed.data.PHONE, buffer.toString('base64'), 100000, 64, 'sha512', function(err, hashed) {
                        if (err) {
                            console.log(err);
                        } else {
                            bodyParsed.data.PHONE = hashed.toString('base64');
                            const field = ['data'];
                            const object = json2csv.parse(bodyParsed.data, field);
                            fs.writeFile('./data.csv', object, function(err) {
                                if (err) {
                                    console.log("write csv error : " + err);
                                } else {
                                    res.writeHead(200, { "Content-Type": "text/plain" });
                                    res.write('save success');
                                    res.end();
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}).listen(3000, function() {
    console.log('connected 3000 port!!');
});