// src/index.js
import dotenv from 'dotenv';
import app from './app.js';  // Usamos import para traer la aplicación Express
import './database.js';      // Conexión a la base de datos

dotenv.config();  // Cargar variables de entorno desde .env

// Iniciar el servidor
async function main() {
  const port = app.get('port');
  await app.listen(port);
  console.log('El servidor se está ejecutando en el puerto:', port);
}

main();
