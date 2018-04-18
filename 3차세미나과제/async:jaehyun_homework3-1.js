const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const async = require('async');

const pwd = '1234qwer';

http.createServer((req, res)=> {
	if (req.url === '/favicon.ico'){
        return;
    } //파비콘 요청때문에 두번 돌아서 요청들어오면 return
	let taskArray = [
		(callback)=>{
			crypto.randomBytes(32, (err, buffer)=>{ 
				callback(null, buffer)
			})
		},
		(buffer, callback)=>{
			crypto.pbkdf2(pwd, buffer.toString('base64'), 100000, 64, 'sha512', (err, hashed)=> {
	        if (err) {
	        	console.log(err)
	        	callback(err, null);
	        }
	        else {
	        	callback(null, hashed.toString('base64'));
	        } 
	      });
		},
		(hashed, callback) => {
            fs.writeFile("pwd.txt", hashed.toString('base64'), (err) =>{
                callback(err, hashed);
            });
        },
		(hashed, callback) => {
			res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
                msg : "success",
                hashed : hashed.toString("base64")
            }));
			callback(null)
		}
	]
		async.waterfall(taskArray, (err)=> {
		if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
                msg:"fail",
                hashed:"err"
            }));		
        } 
	});	
}).listen(3000, function() {
	console.log("Connected 3000 port");	
});





	