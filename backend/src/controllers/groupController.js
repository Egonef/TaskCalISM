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

    const { nombre, descripcion } = req.body;

    try {
        const grupoExistente = await Grupo.findOne({ nombre });
        if (grupoExistente) {
            return res.status(409).json({ message: "El grupo ya existe" });
        }

        const newGroup = new Grupo({
            nombre,
            descripcion,
            fecha_nacimiento,
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