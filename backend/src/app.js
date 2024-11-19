// src/app.js
import express from 'express';  // Usamos import para traer express

const app = express();

// Configura el puerto
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(express.json());

// Rutas
import userRoutes from './routes/userRoute.js';  // Importa las rutas usando import
import taskRoutes from './routes/taskRoute.js';
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Exporta la aplicación
export default app;  // Usamos export default para exportar el app
