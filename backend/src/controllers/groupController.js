import Grupo from '../models/Grupo.js'
import Usuario from '../models/Usuario.js'
import asyncHandler from 'express-async-handler'


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

export const getGroup = asyncHandler(async(req, res) => { 
    
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

export const createGroup = asyncHandler(async(req, res) => { //CU03

    const { nombre , descripcion} = req.body;

    try {
        const admin = await Usuario.findById(req.params.user)  
        const grupoExistente = await Grupo.findOne({ nombre });
        if (grupoExistente) {
            return res.status(409).json({ message: "El grupo ya existe" });
        }

        const id_calendario = "0"; //Provisional
        
        if (!admin) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const newGroup = new Grupo({
            nombre,
            descripcion,
            id_calendario, 
            id_admin:admin,
            id_usuarios:admin //deberiamos de ponerlo en el models
        });

        admin.id_grupos.push(newGroup);
        await newGroup.save();
        await admin.save();
        
        res.status(200).json({ message: "El grupo ha sido creado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


//CUANDO SE ELIMINA UN GRUPO, HAY QUE ELIMINAR TODAS LAS CATEGORIAS Y TAREAS ASOCIADAS A ESE GRUPO: TO DO!!!!!
export const deleteGroup = asyncHandler(async(req, res) => { //CU07
   
    const {nombre_usuario} = req.body;
    try {

        const usuario = await Usuario.findOne({nombre_usuario});
        
        if(!usuario){
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const grupo = await Grupo.findById(req.params.id);

        if(!grupo.id_admin.equals(usuario._id)){ 
            res.status(409).json({ message: "El usuario no es el administrador del grupo" });
        }
        else{
            //HAY QUE PROBARLO
            await Grupo.findByIdAndDelete(grupo._id); 
            const categoriasAEliminar = await Categoria.find({id_grupo: grupo._id});
            if (categoriasAEliminar){
                for (const categoria of categoriasAEliminar) {
                    await Categoria.findByIdAndDelete(categoria._id);
                    await TareaGrupo.findByIdAndDelete(categoria._id)
                    await TareaGrupo.deleteMany({ id_categoria_grupo: req.params.id })
                }
            }else{
                return res.status(404).json({ message: "No se han encontrado categorias para eliminar" });
            }

            //buscamos los usuarios que contengan el id del grupo en su variable
            const usuarios = await Usuario.find({ _id: { $in: grupo.id_usuarios } });
            for (const usuario of usuarios) {
                usuario.id_grupos = usuario.id_grupos.filter(id_grupo => !id_grupo.equals(grupo._id));
                await usuario.save();
            }
            

            //await usuario.save();
            res.status(200).json({ message: 'El grupo ha sido eliminado' });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

export const addUserToAGroup = asyncHandler(async(req, res) => { //CU04, diria que no es nada de backend

})


//CUANDO SE ELIMINA UN USUARIO DE UN GRUPO, HAY QUE ELIMINAR TODAS LAS ASIGNACIONES AL USUARIO: TO DO!!!!!
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