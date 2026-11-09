# Usamos una versión ligera de Node
FROM node:20-alpine

# Crear directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Se copia el resto del código
COPY . .

# Se expone el puerto interno 
EXPOSE 8000

# Iniciar la tienda
CMD ["npm", "start"]