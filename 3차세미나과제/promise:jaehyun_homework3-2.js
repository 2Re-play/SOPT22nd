const http = require('http');
const fs = require('fs');
const crypto = require('crypto-promise');

http.createServer((req, res)=>{
		return new Promise((resolve, reject)=>{
			const pwd = '1234qwer';
			const salt = crypto.randomBytes(32);
			if (req.url === '/favicon.ico'){
				return;
			} 
			crypto.pbkdf2(pwd, salt.toString('base64'), 100000, 64, 'sha512').then((hashed)=>{
				fs.writeFile('./pwd2.txt', hashed.toString('base64'), (err) => {
					if (err) throw err;
				  });
				res.statusCode = 200;
            	res.setHeader('Content-Type', "application/json");
            	res.end(JSON.stringify({
                	msg : 'success',
                	hashed : hashed.toString('base64')
            	}));
            }).catch((err)=>{
                res.statusCode = 500;
            	res.setHeader('Content-Type', 'application/json');
            	res.end(JSON.stringify({
                	msg:'fail',
                	hashed:'err'
            	}));
            })
		});
}).listen(3000, function() {
	console.log("Connected 3000 port");
});