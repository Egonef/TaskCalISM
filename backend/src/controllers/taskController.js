import Tarea from '../models/TareaUsuario.js'
import asyncHandler from 'express-async-handler'


// Tus rutas van aquí
    // GETS GENERICOS

///api/users
export const getTasks = asyncHandler(async(req, res) => {
    console.log("llamada a getTasks")
    const tasks = [
        { id: 1, descripcion: "KK 1", completada: false },
        { id: 2, descripcion: "Si 2", completada: true },
        { id: 3, descripcion: "Pepe 3", completada: false },
        { id: 4, descripcion: "Pepito 4", completada: true }
    ];
    res.json(tasks)
})