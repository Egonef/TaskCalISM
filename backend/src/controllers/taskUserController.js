import TareaUsuario from '../models/TareaUsuario.js';
import Usuario from '../models/Usuario.js';
import CategoriaUsuario from '../models/CategoriaUsuario.js';

import asyncHandler from 'express-async-handler'


// Tus rutas van aquí
    // GETS GENERICOS

///api/tasks?id_categoria_usuario=0
export const getTasksUser = asyncHandler(async(req, res) => {  //CU09, que diferencia hay con el getTasksByCategoryUser de categoryUserController.js??
    try{
        const {id_categoria_usuario} = req.query
        const tasks = await Tarea.find({id_categoria_usuario})
        res.status(200).json(tasks)

    }catch(error){
        res.status(500).json({ message: error.message });
    }
})
///api/tasks
export const createTaskUser = asyncHandler(async (req, res) => { //CU11
    const { nombre, descripcion, fecha_vencimiento, id_categoria_usuario } = req.body;

    try {
        // Verificar si el usuario asociado existe
        const usuarioExistente = await Usuario.findById(id_usuario);
        if (!usuarioExistente) {
            return res.status(404).json({ message: "El usuario asociado no existe" });
        }

        // Verificar si la categoría asociada existe
        const categoriaExistente = await CategoriaUsuario.findById(id_categoria_usuario);
        if (!categoriaExistente) {
            return res.status(404).json({ message: "La categoría asociada no existe" });
        }

        // Crear una nueva tarea
        const nuevaTarea = new Tarea({
            nombre,
            descripcion,
            fecha_vencimiento,
            estado: false,
            id_categoria_usuario,
        });

        // Guardar la tarea en la base de datos
        await nuevaTarea.save();
        res.status(201).json({ message: "La tarea ha sido creada correctamente", tarea: nuevaTarea });
    } catch (error) {
        // Capturar errores y enviar una respuesta adecuada
        res.status(500).json({ message: "Error al crear la tarea", error: error.message });
    }
});

///api/tasks/modify/:id
export const modifyTaskUser = asyncHandler(async (req, res) => { //CU12
    const { id } = req.params; // ID de la tarea a modificar
    const { nombre, descripcion, fecha_vencimiento, estado, id_categoria_usuario } = req.body;

    try {
        // Verificar si la tarea existe
        const tarea = await TareaUsuario.findById(id);
        if (!tarea) {
            return res.status(404).json({ message: "La tarea no existe" });
        }

        // Actualizar los campos con los nuevos valores si están presentes
        tarea.nombre = nombre || tarea.nombre;
        tarea.descripcion = descripcion || tarea.descripcion;
        tarea.fecha_vencimiento = fecha_vencimiento || tarea.fecha_vencimiento;
        tarea.estado = estado !== undefined ? estado : tarea.estado;
        //tarea.id_categoria_usuario = id_categoria_usuario || tarea.id_categoria_usuario;

        // Guardar los cambios
        const tareaActualizada = await tarea.save();
        res.status(200).json({ message: "La tarea ha sido actualizada correctamente", tarea: tareaActualizada });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la tarea", error: error.message });
    }
});

///api/tasks/delete/:id
export const deleteTaskUser = asyncHandler(async (req, res) => { //CU13
    const { id } = req.params; // ID de la tarea a eliminar

    try {
        // Verificar si la tarea existe
        const tarea = await TareaUsuario.findById(id);
        if (!tarea) {
            return res.status(404).json({ message: "La tarea no existe" });
        }

        // Eliminar la tarea
        await tarea.deleteOne();
        res.status(200).json({ message: "La tarea ha sido eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la tarea", error: error.message });
    }
});
///api/tasks/gettask/:id
export const getTaskUser = asyncHandler(async(req,res) => { //CU10
    const { id } = req.params;

    try{
        const tarea = await TareaUsuario.findById(id);
        if (!tarea) {
            return res.status(404).json({ message: "La tarea no existe" });
        }

        res.status(200).json(tarea);
    } catch (error){
        res.status(500).json({message: "Error al buscar la tarea."});
    }
})
///api/tasks/endtask/:id
export const endTaskUser = asyncHandler(async(req,res) => { //CU15
    const { id } = req.params;
    try{
        const tarea = await TareaUsuario.findById(id);

        if (!tarea) {
            return res.status(404).json({ message: "La tarea no existe." });
        }

        if(!tarea.estado){
            tarea.estado = true;
            await tarea.save();
            res.status(200).json({ message: "La tarea se cambio a completada."});
        }
        else{
            res.status(200).json({ message: "La tarea ya estaba completada."});
        }       
    } catch (error){
        res.status(500).json({ message: "Error al encontrar la tarea."});
    }
});
///api/tasks/tasksToday/:id
export const tareasDiariasUser = asyncHandler (async(req,res) => { //CU18
    const { id_categoria_usuario } = req.params;

    const fechaActual = new Date();
    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaActual.getDay() + 1);
    try{
        const tareas = await Tarea.find({
            id_categoria_usuario: id_categoria_usuario, // Filtrar por el ID de la categoria
            fecha_vencimiento: { $gte: fechaActual, $lte: fechaLimite } // Fecha de vencimiento dentro del rango
        });
        res.status(200).json(tareas);
        } catch (error){
        res.status(500).json({message: "Error al buscar las tareas."})
    }
})
///api/tasks/calendar/:id
export const calendarioTareasUser = asyncHandler (async(req,res) => { //CU16
    const { id_categoria_usuario } = req.params;

    const fechaActual = new Date();
    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaActual.getMonth() + 1);
    try{
        const tareas = await Tarea.find({
            id_categoria_usuario: id_categoria_usuario, // Filtrar por el ID de la categoria
            fecha_vencimiento: { $gte: fechaActual, $lte: fechaLimite } // Fecha de vencimiento dentro del rango
        });
        res.status(200).json(tareas);
        } catch (error){
        res.status(500).json({message: "Error al buscar las tareas."})
    }
})