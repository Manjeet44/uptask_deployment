const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
require('dotenv').config({ path: 'variables.env'});

//Helpers con algunas funciones
const helpers = require('./helpers');

//Crear la conexion a la BD
const db = require('./config/db');

//Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error))

//Crear una app de express
const app = express();

//Donde cargar los archivos estaticos
app.use(express.static('public'));

//Habilitar PUG
app.set('view engine', 'pug');

//Habilitar bodyparser para leer datos del fomulario
app.use(bodyParser.urlencoded({extended: true}));

//Añadir a la carpeta de vistas
app.set('views', path.join(__dirname, './views'));

//Agregar flash msj
app.use(flash());

app.use(cookieParser());

//Sessiones nos permiten navegar entre distintas paginas sin volvernos a autenitcar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Pasar var dump a la aplicacion
app.use((req, res, next) => {
    res.locals.year = 2022;
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    console.log(res.locals.usuario);
    next();
});

app.use((req, res, next) => {
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
});

app.use('/', routes());


//Servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 7000;

app.listen(port, host, () => {
    console.log('El servidor esta Funcionando')
});