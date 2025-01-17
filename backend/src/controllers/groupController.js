import Grupo from '../models/Grupo.js'
import Usuario from '../models/Usuario.js'
import CategoriaGrupo from '../models/CategoriaGrupo.js'
import TareaGrupo from '../models/TareaGrupo.js'
import TareaMiembro from '../models/TareaMiembro.js'
import asyncHandler from 'express-async-handler'
import { generarNotificacion } from '../notificationServices/notificationsServices.js'


// Tus rutas van aquí
    // GETS GENERICOS

//error 404: no se ha encontrado; error 409: conflicto

///api/group
export const getGroups = asyncHandler(async(req, res) => { //NO TIENE CU
    try{
        const groups = await Grupo.find({})
        res.status(200).json(groups)

    }catch(error){
        res.status(500).json({ message: error.message });
    }
})
///api/group/:id
export const getGroup = asyncHandler(async(req, res) => { 
    console.log(req.params.id)
    try{
        const group = await Grupo.findById(req.params.id);
        if(group)
            res.status(200).json(group)
        else
            res.status(404).json({ message: "Grupo no encontrado" });

    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

///api/group/user/:id_usuario
export const getGroupsUser = asyncHandler(async(req, res) => { //NO TIENE CU
    try{
        const usuario = await Usuario.findById(req.params.id_usuario);
        if (!usuario) {
            return res.status(404).json({ message: "El usuario asociado no existe" });
        }
        const groups = await Grupo.find({ _id: { $in: usuario.id_grupos } });
        res.status(200).json(groups)

    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

///api/group/members/:id_grupo
export const getMembersGroup = asyncHandler(async(req, res) => { //NO TIENE CU
    try{
        const group = await Grupo.findById(req.params.id_grupo);
        if (!group) {
            return res.status(404).json({ message: "El grupo no existe." });
        }
        const users = await Grupo.find({ _id: { $in: group.id_usuarios } });
        res.status(200).json(users)

    }catch(error){
        res.status(500).json({ message: error.message });
    }
})
///api/user/:user
export const createGroup = asyncHandler(async(req, res) => { //CU03

    const { nombre , descripcion} = req.body;

    try {
        const admin = await Usuario.findById(req.params.user)  
        const grupoExistente = await Grupo.findOne({ nombre });
        if (grupoExistente) {
            return res.status(409).json({ message: "El grupo ya existe" });
        }
        
        if (!admin) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const newGroup = new Grupo({
            nombre,
            descripcion,
            id_admin:admin,
            id_usuarios:admin //deberiamos de ponerlo en el models
        });

        admin.id_grupos.push(newGroup);
        await newGroup.save();
        await admin.save();

        const Categoria = new CategoriaGrupo({ //Categoria "Sin categoria"
            nombre: "Sin Categoria",
            descripcion: "Tareas sin categoria definida",
            id_grupo: newGroup._id,
        });
        await Categoria.save();
        console.log("categoria guardada:", Categoria);
        
        res.status(200).json({ message: "El grupo ha sido creado correctamente" });
    } catch (error) {
        console.error("Error al crear el grupo:", error); // Para ver detalles del error
        res.status(500).json({ message: error.message, stack: error.stack }); // Añadido el stack para más detalles
    }
})

///api/group/invite
export const inviteUserGroup = asyncHandler(async(req,res) => { //CU04
    console.log("Invitando a un usuario a un grupo");
    const {id_admin, id_group, nombre_usuario} = req.body;
    console.log("Datos recibidos:", req.body);
    try {
        const usuario = await Usuario.findOne({nombre_usuario});   
        if(!usuario){
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const grupo = await Grupo.findById(id_group);
        if(!grupo){
            return res.status(404).json({ message: "Grupo no encontrado" });
        }

        const admin = await Usuario.findById(id_admin);
        if(!admin || !admin._id.equals(grupo.id_admin)){
            return res.status(403).json({ message: "Solo el administrador puede invitar usuarios." });
        }
        console.log("Usuario encontrado:", usuario);
        console.log("Grupo encontrado:", grupo);
        console.log("Admin encontrado:", admin);


        const usuarioEnGrupo = grupo.id_usuarios.some(u => u.usuario && u.usuario.toString() === usuario._id);
        if (usuarioEnGrupo) {
            return res.status(409).json({ message: "El usuario ya está en este grupo" });
        }

        const grupoEnUsuario = usuario.id_grupos.some(g => g.grupo && g.grupo.toString() === id_group);
        if (grupoEnUsuario) {
            return res.status(409).json({ message: "El grupo ya está asociado a ese usuario." });
        }
        // Generar notificacion de invitación. TO DO
        // Debe incluirse el nombre del admin en la notificación, para evitar problemas de seguridad en
        // accept invitation group. (Cualquiera podría autoinvitarse si obtiene el id del grupo.)
        // invitacionAGrupo
        const tipo = 'invitacionAGrupo'; // Tipo de notificación
        const datos = {
        nombre_usuario: usuario.nombre_usuario,
        nombre_usuario_asignador: admin.nombre_usuario,
        nombre_grupo: grupo.nombre,
        id_grupo: grupo._id
        };

        (async () => {
            try {
              await generarNotificacion(tipo, datos, usuario._id);
              console.log('Notificación generada exitosamente.');
            } catch (error) {
              console.error('Error al generar la notificación:', error.message);
            }
          })();

        res.status(200).json({ message: 'Se ha invitado el usuario al grupo.' });
    } catch (error){
        console.log("Error:", error);
        return res.status(500).json({ message: error.message});
    }
})

//CUANDO SE ELIMINA UN GRUPO, HAY QUE ELIMINAR TODAS LAS CATEGORIAS Y TAREAS ASOCIADAS A ESE GRUPO: TO DO!!!!!
///api/group/delete/:id
export const deleteGroup = asyncHandler(async(req, res) => { //CU07
    const {id_admin} = req.body;
    try {

        const usuario = await Usuario.findById(id_admin);
        if(!usuario){
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const grupo = await Grupo.findById(req.params.id);
        if(!grupo){
            return res.status(404).json({ message: "Grupo no encontrado" });
        }

        if(!grupo.id_admin.equals(usuario._id)){ 
            return res.status(409).json({ message: "El usuario no es el administrador del grupo" });
        }
        
        let bool1 = false;
        let bool2 = false;
        for (let i = 0; i < usuario.id_grupos.length; i++) {
            if (usuario.id_grupos[i].equals(grupo._id)) {
                bool1 = true;
            }
        }
        for (let i = 0; i < grupo.id_usuarios.length; i++) {
            if (grupo.id_usuarios[i].equals(usuario._id)) {
                bool2 = true;
            }
        }
        
        if(bool1 === false && bool2 === false){
            return res.status(409).json({ message: "El usuario no pertenece al grupo" });
        }

        
        //HAY QUE PROBARLO
        await Grupo.findByIdAndDelete(grupo._id); 
        const categoriasAEliminar = await CategoriaGrupo.find({id_grupo: grupo._id});
        if (categoriasAEliminar.length > 0){

            for (const categoria of categoriasAEliminar) { //Eliminamos categorias
                const tareasAEliminar = await TareaGrupo.find({id_categoria_grupo: categoria._id});
                await CategoriaGrupo.findByIdAndDelete(categoria._id);

                if(tareasAEliminar.length > 0){
                    for (const tarea of tareasAEliminar){ //Eliminamos tareas
                        const tareasMiembro = await TareaMiembro.find({id_tarea_grupo: tarea._id});
                        await TareaGrupo.findByIdAndDelete(tarea._id);

                        if(tareasMiembro.length > 0)
                        for (const tareaM of tareasMiembro){ //Eliminamos asignaciones
                            await TareaMiembro.findByIdAndDelete(tareaM._id);
                        }
                    }
                }
            }
        }

        //buscamos los usuarios que contengan el id del grupo en su variable
        const usuarios = await Usuario.find({ _id: { $in: grupo.id_usuarios } });
        for (const usuario of usuarios) {
            usuario.id_grupos = usuario.id_grupos.filter(id_grupo => !id_grupo.equals(grupo._id));
            await usuario.save();
        }
        

        //await usuario.save();
        return res.status(200).json({ message: 'El grupo ha sido eliminado correctamente' });
        

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

//CUANDO SE ELIMINA UN USUARIO DE UN GRUPO, HAY QUE ELIMINAR TODAS LAS ASIGNACIONES AL USUARIO: TO DO!!!!!
///api/group/deleteUser/:admin
export const deleteUserGroup = asyncHandler(async(req, res) => { //CU05

    const {nombre_usuario, nombre} = req.body; //nombre es el nombre de grupo
    try {

        const usuario = await Usuario.findById(req.params.admin);
        const usuarioAEliminar = await Usuario.findOne({nombre_usuario});

        if(!usuario){
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if(!usuarioAEliminar){
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if(usuario._id.equals(usuarioAEliminar._id)){
            return res.status(409).json({ message: "No puedes eliminarte a ti mismo" });
        }
        const grupo = await Grupo.findOne({nombre});

        if(!grupo.id_admin.equals(usuario._id)){ 
            res.status(409).json({ message: "El usuario no es el administrador del grupo" });
        }
        else{
            usuarioAEliminar.id_grupos = usuarioAEliminar.id_grupos.filter(id_grupo => !id_grupo.equals(grupo._id));
            await usuarioAEliminar.save();
            
            grupo.id_usuarios = grupo.id_usuarios.filter(id_usuario => !id_usuario.equals(usuarioAEliminar._id));
            await grupo.save();

            asignacionesAEliminar = await TareaMiembro.find({id_usuario: usuarioAEliminar._id});

            //SI HAY UNA TAREA DONDE SOLO ESTA ASIGNADO ESE USUARIO, SE ELIMINA LA TAREA??? COMPROBAR LO DE ABAJO
            for (const tareasM of asignacionesAEliminar){
                await TareaMiembro.findByIdAndDelete(tareasM._id);
            }

            res.status(200).json({ message: 'El usuario ha sido eliminado del grupo' });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

})


export const deleteMemberGroup = asyncHandler(async(req, res) => { //CU05
    console.log("Eliminando a un miembro de un grupo");
    const {nombre_usuario, nombre} = req.body; //nombre es el nombre de grupo
    console.log("Datos recibidos:", req.body);
    try {
        console.log("Buscando al usuario...");
        const usuarioAEliminar = await Usuario.findOne({nombre_usuario});
        console.log("Usuario encontrado:", usuarioAEliminar);
        if(!usuarioAEliminar){
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        console.log("Buscando al grupo...");
        const grupo = await Grupo.findOne({nombre});

        console.log("Grupo encontrado:", grupo);

        console.log("Comprobando si el usuario es miembro del grupo...");
        usuarioAEliminar.id_grupos = usuarioAEliminar.id_grupos.filter(id_grupo => !id_grupo.equals(grupo._id));
        await usuarioAEliminar.save();

        grupo.id_usuarios = grupo.id_usuarios.filter(id_usuario => !id_usuario.equals(usuarioAEliminar._id));
        await grupo.save();

        console.log("Buscando asignaciones a eliminar...");
        /*
        asignacionesAEliminar = await TareaMiembro.find({id_usuario: usuarioAEliminar._id});
        console.log("Asignaciones encontradas:", asignacionesAEliminar);
        //SI HAY UNA TAREA DONDE SOLO ESTA ASIGNADO ESE USUARIO, SE ELIMINA LA TAREA??? COMPROBAR LO DE ABAJO
        for (const tareasM of asignacionesAEliminar){
            await TareaMiembro.findByIdAndDelete(tareasM._id);
        }
        */

        res.status(200).json({ message: 'El usuario ha sido eliminado del grupo' });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

})