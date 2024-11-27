import asyncHandler from 'express-async-handler'
import Usuario from '../models/Usuario.js';
import CategoriaUsuario from '../models/CategoriaUsuario.js';
import CategoriaGrupo from '../models/CategoriaGrupo.js';


/*
----------------------------------
    CATEGORIAS DE USUARIOS
    ------------------------------
*/

///api/categories/user?id_usuario=0
export const getCategoriesUser = asyncHandler(async(req, res) => { 
    try{
        const {id_usuario} = req.query
        const categories = await CategoriaUsuario.find({id_usuario})
        res.status(200).json(categories)

    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

///api/categories/user
export const createCategoryUser = asyncHandler(async (req, res) => {
    const { nombre, descripcion, id_usuario } = req.body;

    try {
        // Verificar si el usuario asociado existe
        const usuarioExistente = await Usuario.findById(id_usuario);
        if (!usuarioExistente) {
            return res.status(404).json({ message: "El usuario asociado no existe" });
        }

        // Crear una nueva categoría
        const Categoria = new CategoriaUsuario({
            nombre,
            descripcion,
            id_usuario,
        });

        // Guardar la categoría en la base de datos
        await Categoria.save();

        // Responder con éxito
        res.status(201).json({ message: "La categoría ha sido creada correctamente", categoria: nuevaCategoria });
    } catch (error) {
        // Capturar errores y enviar una respuesta adecuada
        res.status(500).json({ message: "Error al crear la categoría", error: error.message });
    }
});

///api/categories/user/modify/:id
export const modifyCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;  // ID de la categoría que se va a modificar
    const { nombre, descripcion } = req.body;  // Nuevos datos para la categoría

    try {
        // Buscar la categoría por ID y actualizarla
        const categoriaModificada = await CategoriaUsuario.findByIdAndUpdate(
            id,
            { nombre, descripcion }, // Nuevos datos para la categoría
            { new: true }  // Devuelve el documento modificado en lugar del original
        );

        // Verificar si la categoría fue encontrada y modificada
        if (!categoriaModificada) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        // Responder con la categoría modificada
        res.status(200).json({
            message: "Categoría modificada correctamente",
            categoria: categoriaModificada
        });
    } catch (error) {
        res.status(500).json({ message: "Error al modificar la categoría", error: error.message });
    }
});

/*
----------------------------------
    CATEGORIAS DE GRUPOS
    ------------------------------
*/
///api/categories/group?id_grupo=0
export const getCategoriesGroup = asyncHandler(async(req, res) => { 
    try{
        const {id_grupo} = req.query
        const categories = await CategoriaGrupo.find({id_grupo})
        res.status(200).json(categories)

    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

///api/categories/group
export const createCategoryGroup = asyncHandler(async (req, res) => {
    const { nombre, descripcion, id_grupo } = req.body;

    try {
        // Verificar si el usuario asociado existe
        const usuarioExistente = await Usuario.findById(id_grupo);
        if (!usuarioExistente) {
            return res.status(404).json({ message: "El usuario asociado no existe" });
        }

        // Crear una nueva categoría
        const Categoria = new CategoriaUsuario({
            nombre,
            descripcion,
            id_grupo,
        });

        // Guardar la categoría en la base de datos
        await Categoria.save();

        // Responder con éxito
        res.status(201).json({ message: "La categoría ha sido creada correctamente", categoria: nuevaCategoria });
    } catch (error) {
        // Capturar errores y enviar una respuesta adecuada
        res.status(500).json({ message: "Error al crear la categoría", error: error.message });
    }
});