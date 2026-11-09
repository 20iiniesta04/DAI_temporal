// ./routes/router_usuarios.js
import express from "express";
import jwt from "jsonwebtoken";
import Usuario from "../model/usuario.js"; 

// Usamos el entorno para la cookie (asumiendo que IN viene de tienda.js)
const IN = process.env.IN || 'development'; 

const router = express.Router();

// Misma clave de respaldo que en tienda.js para coherencia del JWT
const SECRET_KEY = process.env.SECRET_KEY || 'mi-clave-secreta-debe-ser-larga';

// funcion auxiliar para obtener la cuenta del carrito
const getCartCount = (req) => {
    const carrito = req.session?.carrito || {};
    return Object.keys(carrito).reduce((count, id) => count + carrito[id].cantidad, 0);
};


// RUTA GET /usuarios/login: Muestra el formulario de login
router.get('/login', (req, res) => {
    const cart_item_count = getCartCount(req);
    res.render("login.html", { 
        error: req.query.error,
        cart_item_count: cart_item_count 
    });
});


// RUTA POST /usuarios/login: Recoge datos, autentica, crea el token y redirige
router.post('/login', async (req, res)=> {
    const { username, password } = req.body;

    try {
        const user = await Usuario.findOne({ username });
        
        // Comprueba usuario y contraseña (bcrypt)
        if (!user || !(await user.comparePassword(password))) {
            return res.redirect('/usuarios/login?error=Credenciales incorrectas');
        }

        
        // Esto asegura que el campo 'admin' se lea correctamente desde el documento NoSQL
        const userObject = user.toObject();

        console.log(`[AUTH DEBUG] El usuario ${username} tiene el rol admin: ${userObject.admin}`); // Ahora esto debería mostrar 'true'
        
        // Crear el payload y generar el JWT con el rol 'admin'
        const payload = { 
            usuario: userObject.username, 
            id: userObject._id, 
            admin: userObject.admin || false // Usamos el objeto plano
        };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

        // Configura la cookie
        res.cookie('access_token', token, {
            httpOnly: true, 
            secure: IN === 'production', 
            sameSite: 'Lax',
            maxAge: 3600000 
        });

	    res.redirect('/');
        
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).redirect('/usuarios/login?error=Error interno del servidor');
    }
}); 


// RUTA GET /usuarios/registro: Muestra el formulario de registro
router.get('/registro', (req, res) => {
    const cart_item_count = getCartCount(req);
    res.render("registro.html", { 
        error: req.query.error,
        cart_item_count: cart_item_count 
    });
});
	
// RUTA POST /usuarios/registro: Crea nuevo usuario, loguea y redirige
router.post('/registro', async (req, res) => {  
    const { username, password } = req.body;

    try {
        const existingUser = await Usuario.findOne({ username });
        if (existingUser) {
            return res.redirect('/usuarios/registro?error=El usuario ya existe');
        }
        
        const newUser = new Usuario({ username, password });
        await newUser.save(); // La contraseña se hashea aquí

        // toObject() para el nuevo usuario
        const newUserObject = newUser.toObject();

        // Generar token y loguear al nuevo usuario
        const payload = { 
            usuario: newUserObject.username, 
            id: newUserObject._id,
            admin: newUserObject.admin || false // Esto siempre será 'false' para un nuevo usuario
        };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

        // Configura la cookie
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: IN === 'production',
            sameSite: 'Lax',
            maxAge: 3600000
        });

	    res.redirect("/");
        
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).redirect('/usuarios/registro?error=Error interno del servidor');
    }
});

// RUTA GET /usuarios/logout: Cierra la sesión
router.get('/logout', (req, res) => {
    // Borrar la cookie del token del navegador (JWT)
    res.clearCookie('access_token');
    
    // Limpiar las variables locales de la aplicación
    req.app.locals.usuario = undefined; 
    req.app.locals.admin = undefined; 
    
    // Destruir la sesión de Express (para el carrito)
    req.session.destroy(err => {
        if (err) console.error("Error al destruir sesión:", err);
        // Redirigir a la página de inicio
        res.redirect('/');
    });
});


export default router;
