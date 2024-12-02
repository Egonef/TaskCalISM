import asyncHandler from 'express-async-handler'
import Usuario from '../models/Usuario.js';
import CategoriaUsuario from '../models/CategoriaUsuario.js';
import CategoriaGrupo from '../models/CategoriaGrupo.js';
import Tarea from '../models/TareaUsuario.js';


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
export const modifyCategoryUser = asyncHandler(async (req, res) => {
    const { id } = req.params; // ID de la tarea a modificar
    const { nombre, descripcion} = req.body;

    try {
        // Verificar si la categoría existe
        const categoria = await CategoriaUsuario.findById(id);
        if (!categoria) {
            return res.status(404).json({ message: "La categoria no existe" });
        }

        // Actualizar los campos con los nuevos valores si están presentes
        categoria.nombre = nombre || categoria.nombre;
        categoria.descripcion = descripcion || categoria.descripcion;

        // Guardar los cambios
        const categoriaActualizada = await categoria.save();
        res.status(200).json({ message: "La categoria ha sido actualizada correctamente", tarea: categoriaActualizada });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la categoria", error: error.message });
    }
});
///api/categories/user/delete/:id
export const deleteCategoryUser = asyncHandler(async (req, res) => {
    const { id } = req.params;  // ID de la categoría a eliminar

    try {
        // Buscar y eliminar la categoría por su ID
        const categoriaEliminada = await CategoriaUsuario.findByIdAndDelete(id);

        // Verificar si la categoría fue eliminada
        if (!categoriaEliminada) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        // Responder con un mensaje de éxito
        res.status(200).json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la categoría", error: error.message });
    }
});
///api/categories/user/tasks/:id
export const getTasksCategoryUser = asyncHandler(async (req,res) => {
    const { id_categoria} = req.params;

    try {
        //Buscar tareas de la categoría
        const tareas = await Tarea.find({id_categoria_usuario : id_categoria});

        if (!tareas || tareas.length === 0) {
            return res.status(404).json({ message: "No se encontraron tareas para esta categoría" });
        }

        res.status(200).json(tareas);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar las tareas"});
    }
})
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

///api/categories/group/modify/:id
export const modifyCategoryGroup= asyncHandler(async (req, res) => {
    const { id } = req.params; // ID de la tarea a modificar
    const { nombre, descripcion} = req.body;

    try {
        // Verificar si la categoría existe
        const categoria = await CategoriaGrupo.findById(id);
        if (!categoria) {
            return res.status(404).json({ message: "La categoria no existe" });
        }

        // Actualizar los campos con los nuevos valores si están presentes
        categoria.nombre = nombre || categoria.nombre;
        categoria.descripcion = descripcion || categoria.descripcion;

        // Guardar los cambios
        const categoriaActualizada = await categoria.save();
        res.status(200).json({ message: "La categoria ha sido actualizada correctamente", tarea: categoriaActualizada });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la categoria", error: error.message });
    }
});
///api/categories/group/delete/:id
export const deleteCategoryGroup = asyncHandler(async (req, res) => {
    const { id } = req.params;  // ID de la categoría a eliminar

    try {
        // Buscar y eliminar la categoría por su ID
        const categoriaEliminada = await CategoriaGrupo.findByIdAndDelete(id);

        // Verificar si la categoría fue eliminada
        if (!categoriaEliminada) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        // Responder con un mensaje de éxito
        res.status(200).json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la categoría", error: error.message });
    }
});
///api/categories/group/tasks/:id
export const getTasksCategoryGroup = asyncHandler(async (req,res) => {
    const { id_categoria} = req.params;

    try {
        //Buscar tareas de la categoría
        const tareas = await Tarea.find({id_categoria_grupo : id_categoria});

        if (!tareas || tareas.length === 0) {
            return res.status(404).json({ message: "No se encontraron tareas para esta categoría" });
        }

        res.status(200).json(tareas);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar las tareas"});
    }
})