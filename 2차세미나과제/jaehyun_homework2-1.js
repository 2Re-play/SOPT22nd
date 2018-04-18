const http = require('http');
const url = require('url');
const querystring = require('querystring');
const crypto = require('crypto');

const server = http.createServer(function(req, res) {
    const Url = 'localhost:3000/test?str=asdf1234';
    const parse = url.parse(Url);
    const queryparse = querystring.parse(parse.query);

    let hashAlgorithm = crypto.createHash('sha512');
    let hashing = hashAlgorithm.update(queryparse.str);
    let hashedString = hashing.digest('base64');

    const result = {
        "hashed": "",
        "msg": "fail"
    }
    if (queryparse.str !== null) {
        result.hashed = queryparse.str;
        result.msg = "success"
    }


    crypto.randomBytes(32, function(err, buffer) {
        if (err) {
            console.log(err);
        } else {
            console.log('buffer : ' + buffer.toString('base64'));

            crypto.pbkdf2(result.hashed, buffer.toString('base64'), 100000, 64, 'sha512', function(err, hashed) {
                if (err) {
                    console.log(err);
                } else {

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({
                        msg: result.msg,
                        hashed: hashed.toString("base64")
                    }));

                }
            });
        }
    });


});
server.listen(3000, function() {
    console.log('connected 3000 port!!');
});