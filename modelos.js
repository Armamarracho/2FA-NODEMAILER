const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

let modelo = {};

let hostDB = 'localhost';
let userDB = 'root';
let passDB = '';
let nameDB = 'prueba';

modelo.inicio = function(nombre, callback){
	callback(null,{nombre: nombre, status: "Conectado"})
}

modelo.verificar = function(email, pass, callback){
	// var emailBD = 'allfadir@ejemplo.com';
	// var passBD = "123456";
	//
	// if (email == emailBD && pass == passBD){
	// 	callback(null,{status: "OK", mensaje: "Usuario encontrado"})
	// }
	// else {
	// 	callback(null,{status: "FAIL", mensaje: "Usuario NO encontrado"})
	// }
	let conexion = mysql.createConnection({
		host: hostDB,
		user: userDB,
		pass: passDB,
		database: nameDB,
	});
    conexion.connect((err)=>{
		if(err){
			console.log(err);
		}
	});

	if(conexion){
		let consulta = "select * from usuarios where correo ='"+email+"'and pass ='"+pass+"'";

		conexion.query(consulta, function(err, fila){
			if(err){
				console.log(err);
			}
			else {
				if(fila.length >= 1){
					let token = jwt.sign({email: email}, 'claveToken2024')
					callback(null, {status:"OK", datos: fila, token: token, mensaje: "Usuario encontrado"})
				}
				else {
					callback(null,{status:"OK", datos: null, mensaje:"Usuario NO encontrado"})
				}
			}
		});
	}

	conexion.end();
}

modelo.enviarCorreo = function(email, token, callback){
	let transportes = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: 'armamarracho@gmail.com',
			pass: 'kmmtwksclbespyxt'
		}
	});

	let mailOptions = {
		from: 'armamarracho@gmail.com',
		to: email,
		subject: 'Confirmación del correo',
		html: '<p>Has click en el siguiente link <a href="http://localhost:3000/verificarToken?token='+token+'"> Has clic aqui</a></p>'
	}
	transportes.sendMail(mailOptions, (error, info)=>{
		if(error){
			console.log(error);

		}
		else{
			console.log("Correo enviado exitosamente");
			callback(null,{status: 'OK', mensaje: "Correo enviado exitosamente"})
		}
	})
}
module.exports = modelo;