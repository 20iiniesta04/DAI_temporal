import express from "express"
import nunjucks from "nunjucks"
import connectDB from "./model/db.js"
import TiendaRouter from "./routes/router_tienda.js"
import session from "express-session"
import CarritoRouter from "./routes/router_carrito.js"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import UsuariosRouter from "./routes/router_usuarios.js"
import AdminRouter from "./routes/router_admin.js"
import ApiRouter from "./routes/router_api.js"
import logger from "./config/logger.js";
import cors from 'cors';

// clave secreta para firmar y verificar el JWT
const SECRET_KEY = process.env.SECRET_KEY || 'mi-clave-secreta-debe-ser-larga';

// Conectamos con la base de datos
await connectDB()

// Creamos la app de Express
const app = express()

app.use(cors()); // Habilitar CORS para todas las rutas

// Variables de entorno
const IN = process.env.IN || 'development'

// MIDDLEWARES CRUCIALES (DEBEN IR PRIMERO)
app.use(express.urlencoded({ extended: true })) // Para leer req.body de formularios

app.use(express.json())

app.use(cookieParser()) // Para leer req.cookies

app.use(session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: false
}))

// Middleware de Autentificación (Establece app.locals.usuario y app.locals.admin)
const autentificación = (req, res, next) => {
    const token = req.cookies.access_token;
    
    if (token) {
        try {
            // Usa la clave secreta compartida para verificar el token
            const data = jwt.verify(token, SECRET_KEY);
            req.username = data.usuario
            
            // Extraer y establecer app.locals.admin
            app.locals.usuario = data.usuario 
            app.locals.admin = data.admin // Establece el rol de admin (true/false)
            
        } catch (err) {
             // Limpia el token si es inválido o expirado
            res.clearCookie('access_token');
            app.locals.usuario = undefined;
            app.locals.admin = undefined;
        }
    } else {
        app.locals.usuario = undefined
        app.locals.admin = undefined; // Asegura que 'admin' es undefined si no hay token
    }
    next()
}

app.use(autentificación)


// Configuración de Nunjucks
nunjucks.configure('views', {
    autoescape: true,
    noCache: IN === 'development',
    watch: IN === 'development',
    express: app
})
app.set('view engine', 'html')

// Archivos estáticos
app.use('/static', express.static('public'))

// montajes de routers
// app.use("/admin", AdminRouter) 
app.use("/usuarios", UsuariosRouter); 
app.use("/carrito", CarritoRouter)  
app.use("/admin", AdminRouter)
app.use("/api/productos", ApiRouter)
app.use("/", TiendaRouter)          


// Test del servidor
app.get("/hola", (req, res) => {
    res.send('Hola desde el servidor')
})

// Test de plantillas
app.get("/test", (req, res) => {
    res.render('test.html')
})


// Servidor escuchando
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`)
    logger.info(`Servidor ejecutandose en http://localhost:${PORT}`)
})
