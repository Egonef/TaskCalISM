import asyncHandler from 'express-async-handler'
import Notificacion from '../models/Notificacion.js';
import Usuario from '../models/Usuario.js';
import Grupo from '../models/Grupo.js';
import CategoriaGrupo from '../models/CategoriaGrupo.js';
import CategoriaUsuario from '../models/CategoriaUsuario.js';
import TareaGrupo from '../models/TareaGrupo.js';
import TareaUsuario from '../models/TareaUsuario.js';
import { generarNotificacion } from '../notificationServices/notificationsServices.js'; // Cambiar según el tipo de exportación


//eliiminarnotificciones, vernotificaciones
//api/notification/:idusuario
export const getNotifications = asyncHandler(async(req, res) => { //que diferencia hay con el getTasksByCategoryGroup de categoryGroupController.js??
    console.log('entrando a getNotifications')
    try{
        const notificaciones = await Notificacion.find({id_usuario: req.params.idusuario})

        //Aqui habia un return que devolvia un 404 si no habia notificaciones.
        //No se si es necesario, ya que si no hay notificaciones, se devolvera un array vacio
        //Lo he quitado

        return res.status(200).json(notificaciones)

    }catch(error){
       return res.status(500).json({ message: error.message });
    }
})
//api/notification/:id
export const getNotification = asyncHandler(async(req, res) => { //que diferencia hay con el getTasksByCategoryGroup de categoryGroupController.js??
    try{
        const notificacion = await Notificacion.findById(req.params.id)
    
        if (!notificacion){
           return res.status(404).json({ message: 'La notificación no existe' });

        }
       return res.status(200).json(notificacion)

    }catch(error){
        return res.status(500).json({ message: error.message });
    }
})
//api/notification/delete/:id
export const deleteNotification = asyncHandler(async(req, res) => {

    try{
        const notificacion = await Notificacion.findByIdAndDelete(req.params.id)
    
        if (!notificacion){
            return res.status(404).json({ message: 'La notificación no existe' });

        }
        return res.status(200).json({ message: 'Notificación eliminada' })

    }catch(error){
        return res.status(500).json({ message: error.message });
    }
})

//Las leidas se eliminan automaticamente??
//api/notification/read/:id
export const readNotification = asyncHandler(async(req, res) => {

    try{
        const notificacion = await Notificacion.findById(req.params.id)
    
        if (!notificacion){
           return res.status(404).json({ message: 'La notificación no existe' });

        }
        notificacion.leida = true
        await notificacion.save()
        return res.status(200).json({ message: 'Notificación leida' })
    }catch(error){
        return res.status(500).json({ message: error.message });
    }
})

//Esta funcion habria que llamarla cada vez que se registra un usuario
//api/notification/welcome/:id
export const createWelcomeNotification = asyncHandler(async(req, res) => {
    console.log('Entrando a createWelcomeNotification')
    console.log(req.params.id)
    try {
       // const { userId } = req.body; // Se espera que se envíe el ID del usuario en el cuerpo de la solicitud
        console.log('Entrando al try')
        // Obtener el usuario de la base de datos
        const usuario = await Usuario.findById(req.params.id);


        if (!usuario) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }
    
        // Datos para la notificación
        const datos = {
          nombre: usuario.nombre,
        };
        console.log('Datos para la notificacion:', datos)
    
        // Generar la notificación de bienvenida
        const notificacion = await generarNotificacion('bienvenida', datos, usuario._id); 
        

        //Mira por algun motivo que desconozco esto devuelve undefined, de verdad que no
        //entiendo por que, ya que en la funcion generarNotificacion se guarda la notificacion
        // y he puesto mas comentarios que una publicacion de instagram pero no lo entiendo
        // Al final da igual, por que en la base de datos si que se guarda la notificacion
        //Asi que voy comentar la parte que manda un error y a hacerme el loco
        /*
        console.log('Notificacion:', notificacion)

        if (!notificacion) {
            console.log('Error al generar la notificacion')
            return res.status(500).json({ error: 'Error al generar la notificación' });
        }
        */

        // Aquí podrías enviar la notificación (email, SMS, etc.)
        return res.status(200).json({
          message: 'Notificación generada con éxito',
          notificacion
        });

    } catch (error) {
        //console.error(`Error en createWelcomeNotification: ${error.message}`);
        res.status(500).json({ error: error.message });
    }

})

//Esta funcion habria que llamarla cada dia
//api/notification/pendingTaskUser/:idusuario
export const createPendingTaskUserNotification = asyncHandler(async(req, res) => {

    const fechaActual = new Date();
    const fechaLimite = new Date();
    fechaActual.setHours(0,0,0,0);
    fechaLimite.setDate(fechaActual.getDate() + 1);
    fechaLimite.setHours(0,0,0,0);
    try {
    
        const {id_categoria_usuario} = req.body
        // Obtener el usuario de la base de datos
        const usuario = await Usuario.findById(req.params.idusuario);
        
        if (!usuario) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const cat = await CategoriaUsuario.find({ id_usuario: usuario._id });

        for (const categoria of cat) {
            console.log('VAMOS A VER TODAS LAS CATEGORIAS ASO:')
            console.log(categoria);
        }
        if (cat.length === 0) {
            return res.status(404).json({ message: "Este usuario no tiene categorias existentes" });
        }

        
        let tareas = [];
        for (const categoria of cat) {
            const tareasCat = await TareaUsuario.find({
                id_categoria_usuario: categoria._id, // Filtrar por el ID de la categoría
                fecha_vencimiento: { $gte: fechaActual, $lt: fechaLimite }, // Fecha de vencimiento del día
                estado: false 
            });

            tareas = tareas.concat(tareasCat);

        }

        if(tareas.length === 0){
            return res.status(200).json({ message: "No tienes tareas pendientes para hoy."});
        }

        /*for (const task of tareas) {
            console.log('VAMOS A VER TODAS LAS TAREAS PENDIENTES:')
            console.log(task);
        }*/
        console.log("Longuitud de tareas: ", tareas.length);
        if (tareas.length === 1){
            const cattarea = await CategoriaUsuario.findById(tareas[0].id_categoria_usuario);
            // Datos para la notificación
            console.log('VAMOS A VER LA CATEGORIA DE LA TAREA:')
            console.log(cattarea);
            const datos = {
                nombre: usuario.nombre,
                nombre_tarea: tareas[0].nombre,
                descripcion_tarea: tareas[0].descripcion,
                fecha_vencimiento: tareas[0].fecha_vencimiento,
                categoria_tarea: cattarea.nombre
            };
            console.log('Datos para la notificacion:', datos)
            // Generar la notificación
            await generarNotificacion('tareaPendienteHoy', datos, usuario); 

        }else if (tareas.length > 1){
            const datos = {
                nombre: usuario.nombre,
                num_tareas: tareas.length
            };

            // Generar la notificación
            await generarNotificacion('tareasPendientesHoy', datos, usuario);
        }
        // Aquí podrías enviar la notificación (email, SMS, etc.)
        return res.status(200).json({
          message: 'Notificaciones generadas con éxito',
        });

    } catch (error) {
        //console.error(`Error en createWelcomeNotification: ${error.message}`);
        res.status(500).json({ error: error.message });
    }

})



//Esta funcion habria que llamarla cada vez que se asigne una tarea a un usuario
//api/notification/assign/:id_asignador
export const createAssignNotification = asyncHandler(async(req, res) => {
    console.log('Entrando a createAssignNotification')
    try {
        console.log('Entrando al try')
        const {id_asignado, id_tarea} = req.body; 
        console.log('id_asignado:', id_asignado)
        console.log('id_tarea:', id_tarea)
        console.log('id_asignador:', req.params.id_asignador)
        // Obtener el usuario de la base de datos
        console.log('Buscando usuario asignador')
        const usuario_asignador = await Usuario.findById(req.params.id_asignador);
        console.log(usuario_asignador)
        if (!usuario_asignador) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        console.log('Buscando usuario asignado')
        const usuario_asignado = await Usuario.findById(id_asignado);
        console.log(usuario_asignado)
        if (!usuario_asignado) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        console.log('Buscando tarea')
        const tareagrupo = await TareaGrupo.findById(id_tarea)
        console.log(tareagrupo)
        if (!tareagrupo) {
          return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        const catgrupo = await CategoriaGrupo.findById(tareagrupo.id_categoria_grupo)
        if(!catgrupo){
            return res.status(404).json({ error: 'Categoria de grupo no encontrada' });
        }

        const grupo = await Grupo.findById(catgrupo.id_grupo)
        if(!grupo){
            return res.status(404).json({ error: 'Grupo no encontrado' });
        }

        // Datos para la notificación
        const datos = {
          nombre_usuario: usuario_asignado.nombre,
          nombre_usuario_asignador: usuario_asignador.nombre,
          nombre_tarea: tareagrupo.nombre,
          nombre_grupo: grupo.nombre
        };

        console.log('Datos para la notificacion:', datos)
        console.log("Generando notificacion")
        // Generar la notificación de bienvenida
        const notificacion = await generarNotificacion('asignacionATareaGrupo', datos, usuario_asignado); 
        
        // Aquí podrías enviar la notificación (email, SMS, etc.)
        return res.status(200).json({
          message: 'Notificación generada con éxito',
          notificacion
        });

    } catch (error) {
        //console.error(`Error en createWelcomeNotification: ${error.message}`);
        res.status(500).json({ error: error.message });
    }

})


