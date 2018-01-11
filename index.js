const express = require('express');
const find = require("./findcep");
const cepController = require("./controllers/cepController");
const app = express();

var api = express.Router()
var code;

app.use('/api/v1', api)

api.get('/cep', cepController.find); 

app.get('*', function(req, res){
  res.status(404).send('Url não encontrada - 404');
});

app.listen(3000, () => console.log('Server running on port 3000!'));