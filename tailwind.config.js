/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.html",      // Busca clases en todos los HTML dentro de 'views'
    "./public/js/**/*.js",    // Busca clases en tus scripts del frontend (como busqueda.js)
    "./routes/**/*.js"        // inyectar HTML desde el router
  ],
  theme: {
    extend: {
      colors: {
        mercadona: '#00802b', 
      }
    },
  },
  plugins: [],
}