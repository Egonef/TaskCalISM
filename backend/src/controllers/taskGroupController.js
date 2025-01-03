import TareaGrupo from '../models/TareaGrupo.js';
import TareaMiembro from '../models/TareaMiembro.js';
import Grupo from '../models/Grupo.js';
import Usuario from '../models/Usuario.js';
import CategoriaGrupo from '../models/CategoriaGrupo.js';

import asyncHandler from 'express-async-handler'


// Tus rutas van aquí
    // GETS GENERICOS
///api/tasks/group/all/:id_grupo
export const getAllTasksGroup = asyncHandler(async(req, res) => {  //CU09, que diferencia hay con el getTasksByCategoryUser de categoryUserController.js??
    try{
        //const {id_grupo} = req.query //TIENE QUE SER QUERY, SI SE PONE BODY NO FUNCIONA NO TOCAR BAJO NINGUN CONCEPTO
        const categorias = await CategoriaGrupo.find({id_grupo : req.params.id_grupo});
        if (categorias.length === 0) {
            return res.status(404).json({ message: "Este grupo no tiene categorias existentes" });
        }

        let tareas = [];
        for (const categoria of categorias) {
            const tareasCategoria = await TareaGrupo.find({
                id_categoria_grupo: categoria._id, // Filtrar por el ID de la categoría 
            });
            tareas = tareas.concat(tareasCategoria);
        }

        res.status(200).json(tareas)

    }catch(error){
        res.status(500).json({ messageTareaUsuario: error.message });
    }
})
///api/tasks?id_usuario=0
export const getTasksCatGroup = asyncHandler(async(req, res) => { //que diferencia hay con el getTasksByCategoryGroup de categoryGroupController.js??
    try{
        //LO SUYO SERIA QUE SE MOSTRASE LA TASKS Y LAS PERSONAS ASIGNADAS, ESO LO VEREMOS EN FRONTEND
        const {id_categoria_grupo} = req.body
        const tasks = await TareaGrupo.find({id_categoria_grupo : id_categoria_grupo})
        console.log(tasks)
        let tasksMembers = []
        for (const task of tasks){
            const tasksM = await TareaMiembro.find({id_tarea_grupo : task})
            tasksMembers = tasksMembers.concat(tasksM)
        }
        if(tasksMembers === 0 ){
            res.status(200).json(tasks)
        }else{
            res.status(200).json(tasksMembers)
        }


    }catch(error){
        res.status(500).json({ message: error.message });
    }
})
///api/tasks
//se pueden crear dos tareas o categorias iguales?????
export const createTaskGroup = asyncHandler(async (req, res) => { //CU11
    const { nombre, descripcion, fecha_vencimiento, id_categoria_grupo } = req.body;
    try {
        // Verificar si el usuario asociado existe
        const grupoExistente = await Grupo.findById(req.params.idgrupo);
        if (!grupoExistente) {
            console.log("Grupo no encontrado")
            return res.status(404).json({ message: "El grupo asociado no existe" });
        }

        // Verificar si la categoría asociada existe
        const categoriaExistente = await CategoriaGrupo.findById(id_categoria_grupo);
        if (!categoriaExistente) {
            return res.status(404).json({ message: "La categoría asociada no existe" });
        }

        const [día, mes, año] = fecha_vencimiento.split('/');
        const fechaProcesada = new Date(`${año}-${mes}-${día}`);

        // Crear una nueva tarea
        const nuevaTarea = new TareaGrupo({
            nombre,
            descripcion,
            fecha_vencimiento: fechaProcesada,
            estado: false,
            id_categoria_grupo,//ponerla como obligatoria
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
export const modifyTaskGroup = asyncHandler(async (req, res) => { //CU13
    //const { id } = req.params; // ID de la tarea a modificar
    const { nombre, descripcion, fecha_vencimiento, estado, id_categoria_grupo } = req.body;
    let fechaProcesada;
    if(fecha_vencimiento){
        const [día, mes, año] = fecha_vencimiento.split('/');
        fechaProcesada = new Date(`${año}-${mes}-${día}`);
    }
    
    try {
        // Verificar si la tarea existe
        const tarea = await TareaGrupo.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ message: "La tarea no existe" });
        }

        // Actualizar los campos con los nuevos valores si están presentes
        tarea.nombre = nombre || tarea.nombre;
        tarea.descripcion = descripcion || tarea.descripcion;
        tarea.fecha_vencimiento = fechaProcesada || tarea.fecha_vencimiento;
        tarea.estado = estado !== undefined ? estado : tarea.estado;
        tarea.id_categoria_grupo = id_categoria_grupo || tarea.id_categoria_grupo;

        // Guardar los cambios
        const tareaActualizada = await tarea.save();
        res.status(200).json({ message: "La tarea ha sido actualizada correctamente", tarea: tareaActualizada });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la tarea", error: error.message });
    }
});

///api/tasks/delete/:id
export const deleteTaskGroup = asyncHandler(async (req, res) => { //CU14
    //const { id } = req.params; // ID de la tarea a eliminar

    try {
        // Verificar si la tarea existe
        const tarea = await TareaGrupo.findById(req.params.id);

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
export const getTaskGroup = asyncHandler(async(req,res) => { //CU10
    const { id } = req.params;

    try{
        const tarea = await TareaGrupo.findById(id);
        if (!tarea) {
            return res.status(404).json({ message: "La tarea no existe" });
        }

        res.status(200).json(tarea);
    } catch (error){
        res.status(500).json({message: "Error al buscar la tarea."});
    }
})
///api/tasks/group/endtask/:id
export const endTaskGroup = asyncHandler(async(req,res) => {
    //const { id } = req.params;
    try{
        const tarea = await TareaGrupo.findById(req.params.id);
        console.log("entre en la funsion")
        if (!tarea) {
            return res.status(404).json({ message: "La tarea no existe." });
        }
        console.log("tarea exite")
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
export const tareasDiariasCatGroup = asyncHandler (async(req,res) => {
    //const { id_categoria_grupo } = req.params;

    const fechaActual = new Date();
    const fechaLimite = new Date();
    fechaActual.setHours(0,0,0,0);
    fechaLimite.setDate(fechaActual.getDate() + 1);
    fechaLimite.setHours(0,0,0,0);
    try{
        const tareas = await TareaGrupo.find({
            id_categoria_grupo: req.params.id_categoria_grupo, // Filtrar por el ID de la categoria
            fecha_vencimiento: { $gte: fechaActual, $lte: fechaLimite } // Fecha de vencimiento dentro del rango
        });
        if(tareas.length === 0){
            return res.status(200).json({ message: "No tienes tareas pendientes para hoy."});
        }
        res.status(200).json(tareas);
        } catch (error){
        res.status(500).json({message: "Error al buscar las tareas."})
    }
})

export const tareasDiariasGroup = asyncHandler (async(req,res) => { 
    //const { id_categoria_usuario } = req.params;

    const fechaActual = new Date();
    const fechaLimite = new Date();
    fechaActual.setHours(0,0,0,0);
    fechaLimite.setDate(fechaActual.getDate() + 1);
    fechaLimite.setHours(0,0,0,0);

    try{
        const grupo = await Grupo.findById(req.params.idgrupo)

        if (!grupo) {
            return res.status(404).json({ message: "Este grupo no existe" });
        }

        const categorias = await CategoriaGrupo.find({id_grupo : grupo});
        if (categorias.length === 0) {
            return res.status(404).json({ message: "Este usuario no tiene categorias existentes" });
        }


        let tareas = [];
        for (const categoria of categorias) {
            const tareasCategoria = await TareaGrupo.find({
                id_categoria_grupo: categoria._id, // Filtrar por el ID de la categoría
                fecha_vencimiento: { $gte: fechaActual, $lt: fechaLimite }, // Fecha de vencimiento del día
                // estado: false 
            });
            tareas = tareas.concat(tareasCategoria);
        }



        if(tareas.length === 0){
            return res.status(200).json({ message: "No existen tareas pendientes para hoy."});
        }
        res.status(200).json(tareas);
        } catch (error){
        res.status(500).json({message: "Error al buscar las tareas."})
    }
})
///api/tasks/calendar/:id
export const calendarioTareasCatGroup = asyncHandler (async(req,res) => {
    //const { id_categoria_grupo } = req.params;

    const fechaActual = new Date();
    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaActual.getMonth() + 1);
    try{
        const tareas = await TareaGrupo.find({
            id_usuario: req.params.id_categoria_grupo, // Filtrar por el ID de la categoria del grupo
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

export const calendarioTareasGroup = asyncHandler (async(req,res) => { 
    //const { id_categoria_usuario } = req.params;

    const fechaActual = new Date();
    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaActual.getMonth() + 1);

    try{
        const grupo = await Grupo.findById(req.params.idgrupo)

        if (!grupo) {
            return res.status(404).json({ message: "Este grupo no existe" });
        }

        const categorias = await CategoriaGrupo.find({id_grupo : grupo});
        if (categorias.length === 0) {
            return res.status(404).json({ message: "Este usuario no tiene categorias existentes" });
        }


        let tareas = [];
        for (const categoria of categorias) {
            const tareasCategoria = await TareaGrupo.find({
                id_categoria_grupo: categoria._id, // Filtrar por el ID de la categoría
                fecha_vencimiento: { $gte: fechaActual, $lt: fechaLimite }, // Fecha de vencimiento del día
                // estado: false 
            });
            tareas = tareas.concat(tareasCategoria);
        }



        if(tareas.length === 0){
            return res.status(200).json({ message: "No existen tareas pendientes para hoy."});
        }
        res.status(200).json(tareas);
        } catch (error){
        res.status(500).json({message: "Error al buscar las tareas."})
    }
})





export const assignMemberToATask = asyncHandler(async(req, res) => { //CU08

        //aqui usar tarea miembro
    const { id_tarea_grupo, id_usuario } = req.body;
    try {
        const usuario = await Usuario.findById(id_usuario);
        const grupo = await Grupo.findById(req.params.idgrupo);
        
        if (!usuario) {
            return res.status(404).json({ message: "El usuario no existe" });
        }
        
        if (!grupo) {
            return res.status(404).json({ message: "El grupo no existe" });
        }

        const pertenece = usuario.id_grupos.filter(id_grupo => id_grupo.equals(grupo._id))
        console.log(pertenece)

        if (pertenece.length === 0) {
            return res.status(404).json({ message: "El usuario no pertenece al grupo" });
        }
        
        const categorias_grupo = await CategoriaGrupo.find({id_grupo: grupo})
        const tareas_del_grupo = await TareaGrupo.find({id_categoria_grupo: categorias_grupo})

        const tareapertenecegrupo = tareas_del_grupo.filter(tarea => tarea._id.toString() === id_tarea_grupo);
        if (!tareapertenecegrupo) {
            return res.status(404).json({ message: "La tarea no existe en el grupo" });
        }

        const tareaMiembroExistente = await TareaMiembro.findOne({ id_tarea_grupo: tareapertenecegrupo, id_usuario: usuario });
        console.log(tareaMiembroExistente)
        if (tareaMiembroExistente) {
            return res.status(409).json({ message: "El usuario ya ha sido asignado a esta tarea anteriormente" });
        }

        // Asignar el miembro a la tarea
        const nuevaTareaMiembro = new TareaMiembro({
            id_tarea_grupo: tareapertenecegrupo,
            id_usuario: usuario,
        });

        await nuevaTareaMiembro.save();
        res.status(201).json({ message: "El miembro ha sido asignado a la tarea correctamente", tareaMiembro: nuevaTareaMiembro });

    }
    catch (error) {
    }

})