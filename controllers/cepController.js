/*
*	cepController
*	Find ZIP code and format response
*/
var request = require('request');
var util = require('util');
var pattern1 = /\d{5}-\d{3}$/;
var pattern2 = /\d{8}$/;

exports.find = function(req, res) {
	if(req.query.code){
		getCep(req.query.code).then(data=>{
			res.status(200).send(data);
		}).catch(err=>{
			res.status(200).send(err);
		});
	}else{
		res.status(400).send("Requisição Inválida 400");
	}
	
};

/*
*	get cep
*	@param {String} cep
*	@return Promise 
*/
function getCep(cep) {
	return new Promise((resolve, reject) =>{
		if(pattern1.test(cep) || pattern2.test(cep)){
			query("https://viacep.com.br/ws/%s/json",cep).then(data=>{
				resolve(data);
			}).catch(e=>{
				query("http://api.postmon.com.br/v1/cep/%s", cep).then(data=>{
					resolve(data);
				}).catch(e=>{
					query("http://cep.republicavirtual.com.br/web_cep.php?cep=%s&formato=json", cep).then(data=>{
						resolve(data);
					}).catch(e=>{
						query("http://appservidor.com.br/webservice/cep?CEP=%s", cep).then(data=>{
							resolve(data);
						}).catch(e=>{
							reject({
								error: true,
								message: "CEP não encontrado"
							});
						});
					});
				});
			});
		}else{
			reject({
				error: true,
				message: "CEP inválido"
			});
		}
	});
}

/*
*	query cep by url and code
*
*	@param {String} url
*	@param {String} cep
* 	@return Promise
*/
function query(url,cep){
	return new Promise((resolve, reject)=>{
		request(util.format(url, cep), function(err,res,body){
			if(!body || err){
				reject();
			}else{
				var data = JSON.parse(body);
				if(data.erro || data.resultado == 0 || data.total == 0){
					reject("CEP não encontrado.")
				}else{
					// console.log(data)
					resolve(adapt(data));
				}
			}
		});
	});
}

/*
*	adpat requisitions to a pre-defined format
*
*	@param {Object} data
*	@return Object
*/
function adapt(data){
	return {
		zipcode: data.cep,
		street: data.logradouro,
		street_number: data.complemento,
		neighborhood: data.bairro,
		city: data.localidade || data.cidade,
		state: data.uf || data.estado,
		ibge: data.ibge
	}
}
