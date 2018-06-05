
const mysql = require('mysql');

const dbConfig = {
	host : 'ourdb-sopt-6.ceuhngw0tvun.ap-northeast-2.rds.amazonaws.com',
	port : 3306,
	user : 'root',
	password : 'sopt6server',
	database : 'sopt'
};

module.exports = mysql.createPool(dbConfig);

