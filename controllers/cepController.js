/*
*	cepController
*	Find ZIP code and format response
*/
var request = require('request'),
	util = require('util'),
	pattern = /^\d{5}-\d{3}$|^\d{8}$/;

exports.find = function(req, res) {
	if(req.query.code){
		getCep(req.query.code).then(data=>{
			res.status(200).send(data);
		}).catch(err=>{
			res.status(400).send(err);
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
		if(pattern.test(cep)){
			query("https://viacep.com.br/ws/%s/json", cep).then(data=>{
				resolve(data);
			}).catch(query("http://api.postmon.com.br/v1/cep/%s", cep).then(data=>{
				resolve(data);	
			}).catch(query("http://appservidor.com.br/webservice/cep?CEP=%s", cep).then(data=>{
				resolve(data);
			}).catch(query("http://appservidor.com.br/webservice/cep?CEP=%s", cep).then(data=>{
				resolve(data);
			}).catch(e=>{
				reject(e);
			}))));
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
				reject({
					error: true,
					message: "CEP inválido"
				});
			}else{
				if(res.statusCode == 200){
					var data = JSON.parse(body);
					if(data.erro || data.resultado == 0 || data.total == 0){
						reject({
							error: true,
							message: "CEP não encontrado"
						})
					}else{
						resolve(adapt(data));
					}
				}else{
					reject({
						error: true,
						message: res.statusMessage
					});
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
