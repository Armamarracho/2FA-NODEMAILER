// Dependencias
const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
// Modelo
const modelo = require('./modelos.js')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


const PORT = 3000

app.get('/', function (req, res) {

	modelo.inicio('Allfadir', function(err, filas){
		if(err){
			return res.status(500).json({error: "Ocurrio un error"})
		}
		else{
			return res.json(filas);
		}
	})
    //res.send('Hello World')
})
app.get('/verificarToken', function(req, res) {
	let token = req.query.token;
	jwt.verify(token, 'claveToken2024', function(err, filas) {
		if (err) {
			return res.status(500).json({ error: "Ocurrio un error" });
		}
		else {
			return res.status(200).json(filas);
		}

	})
})
app.get('/verificar', function(req, res){
	let email = req.query.email;
	let pass = req.query.pass;
    modelo.verificar(email, pass, function(err, filas){
		if(err){
			return res.status(500).json({error: "Ocurrio un error"})
		}
		else {
			return res.json(filas);
		}
	})
})

app.post('/enviarCorreo', function(req, res){
	let email = req.body.email;
	let token = req.body.token;

	modelo.enviarCorreo(email, token, function(err, filas){
		if(err){
			return res.status(500).json({error: "Ocurrio un error"})
		}
		else {
			return res.json(filas);
		}
	})
})


app.listen(PORT, () => {
})