var request = require('request');
var util = require('util');
var pattern1 = /\d{5}-\d{3}$/;
var pattern2 = /\d{8}$/;

module.exports = function(cep) {
	return new Promise((resolve, reject) =>{
		if(pattern1.test(cep) || pattern2.test(cep)){
			request(util.format("https://viacep.com.br/ws/%s/json", cep), function(err,res,body){
				resolve(JSON.parse(body))
			});
		}else{
			reject()
		}
		
	});
}