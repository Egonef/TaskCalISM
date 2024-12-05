import Grupo from '../models/Grupo.js'
import Usuario from '../models/Usuario.js'
import asyncHandler from 'express-async-handler'


// Tus rutas van aquí
    // GETS GENERICOS

//error 404: no se ha encontrado; error 409: conflicto

///api/groups
export const getGroups = asyncHandler(async(req, res) => { //NO TIENE CU
    try{
        const groups = await Grupo.find({})
        res.status(200).json(groups)

    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

//no es necesario un getGroup??

export const createGroup = asyncHandler(async(req, res) => { //CU03

    const { nombre , descripcion} = req.body;

    try {
        const admin = await Usuario.findById(req.params.id)  
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
        //grupo.id_usuarios.push(admin);

        await newGroup.save();
        res.status(200).json({ message: "El grupo ha sido creado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

export const deleteGroup = asyncHandler(async(req, res) => { //CU07
   
    const {nombre_usuario} = req.body;
    try {

        const usuario = await Usuario.findOne({nombre_usuario});
        
        if(!usuario){
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const grupo = await Grupo.findById(req.params.id);

        

        if(grupo.id_admin.some(usuario => usuario.equals(usuario._id))){ //revisar esto pq esta mal
            res.status(409).json({ message: "El usuario no es el administrador del grupo" });

        }
        else{
            await Grupo.findByIdAndDelete(grupo._id);
            usuario.id_grupos = usuario.id_grupos.filter(id_grupo => id_grupo != grupo._id);
            await usuarioAEliminar.save();
            res.status(200).json({ message: 'El grupo ha sido eliminado' });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

export const addUserToAGroup = asyncHandler(async(req, res) => { //CU04, diria que no es nada de backend

})

export const deleteUserGroup = asyncHandler(async(req, res) => { //CU05

    const {nombre_usuario, nombre, nombre_usuario_a_eliminar} = req.body;
    try {

        const usuario = await Usuario.findOne({nombre_usuario});
        const usuarioAEliminar = await Usuario.findOne({nombre_usuario_a_eliminar});
        
        if(!usuario){
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if(!usuarioAEliminar){
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const grupo = await Grupo.findOne(nombre);

        if(grupo.id_admin != usuario._id){
            res.status(409).json({ message: "El usuario no es el administrador del grupo" });
        }
        else{
            usuarioAEliminar.id_grupos = usuarioAEliminar.id_grupos.filter(id_grupo => id_grupo != grupo._id);
            await usuarioAEliminar.save();
            grupo.id_usuarios = grupo.id_usuarios.filter(id_usuario => id_usuario != usuarioAEliminar._id);
            await grupo.save();
            res.status(200).json({ message: 'El grupo ha sido eliminado' });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

})