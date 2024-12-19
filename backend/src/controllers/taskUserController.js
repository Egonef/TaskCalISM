import TareaUsuario from '../models/TareaUsuario.js';
import Usuario from '../models/Usuario.js';
import CategoriaUsuario from '../models/CategoriaUsuario.js';

import asyncHandler from 'express-async-handler'


// Tus rutas van aquí
    // GETS GENERICOS

///api/tasks?id_categoria_usuario=0
export const getTasksUser = asyncHandler(async(req, res) => {  //CU09, que diferencia hay con el getTasksByCategoryUser de categoryUserController.js??
    try{
        const {id_categoria_usuario} = req.body
        const tasks = await TareaUsuario.find({id_categoria_usuario})
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
        const usuarioExistente = await Usuario.findById(req.params.idusuario);
        if (!usuarioExistente) {
            return res.status(404).json({ message: "El usuario asociado no existe" });
        }

        // Verificar si la categoría asociada existe
        const categoriaExistente = await CategoriaUsuario.findById(id_categoria_usuario);
        if (!categoriaExistente) {
            return res.status(404).json({ message: "La categoría asociada no existe" });
        }

        // Crear una nueva tarea
        const nuevaTarea = new TareaUsuario({
            nombre,
            descripcion,
            fecha_vencimiento,
            estado: false,
            id_categoria_usuario,
        });


        // Guardar la tarea en la base de datos
        await nuevaTarea.save();
        res.status(201).json({ message: "La tarea ha sido creada correctamente" });
    } catch (error) {
        // Capturar errores y enviar una respuesta adecuada
        res.status(500).json({ message: "Error al crear la tarea", error: error.message });
    }
});

///api/tasks/modify/:id
export const modifyTaskUser = asyncHandler(async (req, res) => { //CU12
    //const { id } = req.params; // ID de la tarea a modificar
    const { nombre, descripcion, fecha_vencimiento, estado, id_categoria_usuario } = req.body;

    try {
        // Verificar si la tarea existe
        const tarea = await TareaUsuario.findById(req.params.id);
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
    //const { id } = req.params; // ID de la tarea a eliminar

    try {
        // Verificar si la tarea existe
        const tarea = await TareaUsuario.findById(req.params.id);
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
    //const { id } = req.params;

    try{
        const tarea = await TareaUsuario.findById(req.params.id);
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
    //const { id } = req.params;
    try{
        const tarea = await TareaUsuario.findById(req.params.id);

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
//Te muestra las tareas pendientes(?) que tienes hoy filtrado por categoria
export const tareasDiariasCatUser = asyncHandler (async(req,res) => { //CU18
    //const { id_categoria_usuario } = req.params;

    const fechaActual = new Date();
    const fechaLimite = new Date();
    fechaActual.setHours(0,0,0,0);
    fechaLimite.setDate(fechaActual.getDate() + 1);
    fechaLimite.setHours(0,0,0,0);

    try{

        const categoria = await CategoriaUsuario.findById(req.params.id_categoria_usuario)
        console.log(categoria)
        if (!categoria) {
            return res.status(404).json({ message: "La categoria no existe." });
        }

        const tareas = await TareaUsuario.find({
            id_categoria_usuario: categoria, // Filtrar por el ID de la categoria
            fecha_vencimiento: { $gte: fechaActual, $lte: fechaLimite},// Fecha de vencimiento dentro del rango
            //estado: false  //y que no esten completas
        });
        if(tareas.length === 0){
            return res.status(200).json({ message: "No tienes tareas pendientes para hoy."});
        }
        res.status(200).json(tareas);
        } catch (error){
        res.status(500).json({message: "Error al buscar las tareas."})
    }
})

//Te muestra las tareas pendientes(?) que tienes hoy
export const tareasDiariasUser = asyncHandler (async(req,res) => { 
    //const { id_categoria_usuario } = req.params;

    const fechaActual = new Date();
    const fechaLimite = new Date();
    fechaActual.setHours(0,0,0,0);
    fechaLimite.setDate(fechaActual.getDate() + 1);
    fechaLimite.setHours(0,0,0,0);

    try{
        const usuario = await Usuario.findById(req.params.idusuario)

        if (!usuario) {
            return res.status(404).json({ message: "Este usuario no existe" });
        }

        const categorias = await CategoriaUsuario.find({id_usuario : usuario});
        if (categorias.length === 0) {
            return res.status(404).json({ message: "Este usuario no tiene categorias existentes" });
        }


        let tareas = [];
        for (const categoria of categorias) {
            const tareasCategoria = await TareaUsuario.find({
                id_categoria_usuario: categoria._id, // Filtrar por el ID de la categoría
                fecha_vencimiento: { $gte: fechaActual, $lt: fechaLimite }, // Fecha de vencimiento del día
                // estado: false 
            });
            tareas = tareas.concat(tareasCategoria);
        }



        if(tareas.length === 0){
            return res.status(200).json({ message: "No tienes tareas pendientes para hoy."});
        }
        res.status(200).json(tareas);
        } catch (error){
        res.status(500).json({message: "Error al buscar las tareas."})
    }
})
///api/tasks/calendar/:id
//Te muestra las tareas que tienes este mes por categoria
export const calendarioTareasCatUser = asyncHandler (async(req,res) => { //CU16
    //const { id_categoria_usuario } = req.params;

    const fechaActual = new Date();
    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaActual.getMonth() + 1);
    try{
        const tareas = await TareaUsuario.find({
            id_categoria_usuario: req.params.id_categoria_usuario, // Filtrar por el ID de la categoria
            fecha_vencimiento: { $gte: fechaActual, $lte: fechaLimite } // Fecha de vencimiento dentro del rango
        });
        if(tareas.length === 0){
            return res.status(200).json({ message: "No tienes tareas pendientes para este mes."});
        }
        res.status(200).json(tareas);
        } catch (error){
        res.status(500).json({message: "Error al buscar las tareas."})
    }
})

//Te muestra las tareas que tienes este mes 
export const calendarioTareasUser = asyncHandler (async(req,res) => { 
    //const { id_categoria_usuario } = req.params;

    const fechaActual = new Date();
    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaActual.getMonth() + 1);

    try{
        const usuario = await Usuario.findById(req.params.idusuario)

        if (!usuario) {
            return res.status(404).json({ message: "Este usuario no existe" });
        }

        const categorias = await CategoriaUsuario.find({id_usuario : usuario});
        if (categorias.length === 0) {
            return res.status(404).json({ message: "Este usuario no tiene categorias existentes" });
        }


        let tareas = [];
        for (const categoria of categorias) {
            const tareasCategoria = await TareaUsuario.find({
                id_categoria_usuario: categoria._id, // Filtrar por el ID de la categoría
                fecha_vencimiento: { $gte: fechaActual, $lt: fechaLimite }, // Fecha de vencimiento del día
                // estado: false 
            });
            tareas = tareas.concat(tareasCategoria);
        }



        if(tareas.length === 0){
            return res.status(200).json({ message: "No tienes tareas pendientes para hoy."});
        }
        res.status(200).json(tareas);
        } catch (error){
        res.status(500).json({message: "Error al buscar las tareas."})
    }
})