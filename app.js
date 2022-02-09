const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const PUERTO = 3000;
const conexion = mysql.createConnection(
    {
        host:'localhost',
        database:'pruebas',
        user: 'root',
        password:''
    }
);

app.listen(PUERTO, ()=>{
    console.log(`Servidor corriendo en el puerto ${PUERTO}`);
});

conexion.connect(error => {
    if(error) throw error;

    console.log('Conexión exitosa a la base de datos');
});

app.get('/', (req, res) => {
    res.send('API');
});

app.get('/usuarios', (req, res) => {
    conexion.query('SELECT * FROM usuarios;', (error, resultados) => {
        if(error) return console.error(error.message);

        if(resultados.length > 0){
            res.json(resultados);
        } else {
            res.send('No hay registros');
        }
    });
});

app.get('/usuarios/:id', (req, res) => {
    const {id} = req.params;

    conexion.query(`SELECT * FROM usuarios WHERE idUsuario=${id};`, (error, resultado) => {
        if(error) return console.error(error.message);

        if(resultado.length > 0){
            res.json(resultado);
        } else {
            res.send('No hay registros');
        }
    });
});

app.post('/add', (req, res) => {
    const usuario = {
        usuario: req.body.usuario,
        contrasena: req.body.contrasena,
        email: req.body.email
    };

    const query = `INSERT INTO usuarios SET ?`;

    conexion.query(query, usuario, (error)=> {
        if(error) return console.error(error.message);

        res.send(`se inserto correctamente el usuario`);
    });
});


app.put('/update/:id', (req, res) => {
    const {id} = req.params;

    const {usuario, contrasena, email} = req.body;

    const query = `UPDATE usuarios SET usuario='${usuario}', contrasena='${contrasena}', email='${email}' WHERE idUsuario='${id}';`;
    conexion.query(query, (error) => {
        if(error) return console.error(error.message);

        res.send(`Se actualizo correctamente el registro ${id}`);
    });
});

app.delete('/delete/:id', (req, res) => {
    const {id} = req.params;

    const query = `DELETE FROM usuarios WHERE idUsuario=${id}`;

    conexion.query(query, (error) => {
        if(error) return console.error(error.message);

        res.send(`Se eliminó correctamente el registro ${id}`);
    });
});