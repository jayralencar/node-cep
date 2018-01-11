const express = require('express');
const find = require("./findcep.js");

const app = express();

var api = express.Router()
var code;

app.use('/api/v1', api)

api.get('/cep', (req, res) => {
	if(req.query.code){
		find(req.query.code).then(e=>{
			res.send(e)
		}).catch(err=>{
			res.send("a")
		})
	}else{
		
	}
	
}); 

app.listen(3000, () => console.log('Server running on port 3000!'));