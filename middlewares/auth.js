// ./middlewares/auth.js

import express from 'express';

// Middleware para restringir el acceso a solo Administradores
export const esAdmin = (req, res, next) => {
    // La variable 'admin' ya ha sido establecida por el middleware de autentificación en tienda.js
    if (req.app.locals.admin) {
        next(); // Es admin, permitir el acceso a la ruta
    } else {
        // No es admin, redirigir a la página de inicio o dar un error 403
        console.warn(`Acceso denegado a ruta de admin por usuario: ${req.app.locals.usuario || 'invitado'}`);
        // Usamos status(403) y renderizamos una plantilla de error si existe
        res.status(403).send("Acceso denegado: Se requieren permisos de administrador."); 
        // Nota: Si quieres usar res.render, debes crear la plantilla 'error.html'
    }
};
