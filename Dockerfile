# Usa una imagen ligera de Node
FROM node:20-alpine
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la app
RUN npm run build

# Exponer el puerto y arrancar
EXPOSE 3000
CMD ["npm", "start"]