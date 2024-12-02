import Grupo from '../models/Grupo.js'
import asyncHandler from 'express-async-handler'


// Tus rutas van aquí
    // GETS GENERICOS

//error 404: no se ha encontrado; error 409: conflicto

///api/groups
export const getGroups = asyncHandler(async(req, res) => {
    try{
        const groups = await Grupo.find({})
        res.status(200).json(groups)

    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

export const createGroup = asyncHandler(async(req, res) => {

    const { nombre, descripcion, id_admin } = req.body;

    try {
        const grupoExistente = await Grupo.findOne({ nombre });
        if (grupoExistente.descripcion == descripcion) {
            return res.status(409).json({ message: "El nombre y la descripcion insertadas coinciden con otro grupo." });
        }

        const newGroup = new Grupo({
            nombre,
            descripcion,
            fecha_nacimiento, //No sé que hacer con esto xd. Hay una variable id_calendario, pero me deja aún más confuso que esta.
            id_admin
        });

        await newGroup.save();
        res.status(200).json({ message: "El usuario ha sido creado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

export const deleteGroup = asyncHandler(async(req, res) => {
    
})

export const addUserToAGroup = asyncHandler(async(req, res) => {

    

})