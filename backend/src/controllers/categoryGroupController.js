import asyncHandler from 'express-async-handler'
import Grupo from '../models/Grupo.js';
import CategoriaGrupo from '../models/CategoriaGrupo.js';
import TareaGrupo from '../models/TareaGrupo.js';


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
        const grupoExistente = await Grupo.findById(id_grupo);
        if (!grupoExistente) {
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
        res.status(200).json({ message: "La categoría ha sido creada correctamente", categoria: nuevaCategoria });
    } catch (error) {
        // Capturar errores y enviar una respuesta adecuada
        res.status(500).json({ message: "Error al crear la categoría", error: error.message });
    }
});

///api/categories/group/modify/:id_categoria
export const modifyCategoryGroup= asyncHandler(async (req, res) => { 
    const { id_categoria } = req.params; // ID de la categoria a modificar
    const { nombre, descripcion} = req.body;

    try {
        // Verificar si la categoría existe
        const categoria = await CategoriaGrupo.findById(id_categoria);
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
    const { id_categoria } = req.params;  // ID de la categoría a eliminar

    try {
        // Buscar y eliminar la categoría por su ID
        const categoriaEliminada = await CategoriaGrupo.findByIdAndDelete(id_categoria);

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
export const getTasksByCategoryGroup = asyncHandler(async (req,res) => {
    const { id_categoria} = req.params;

    try {
        //Buscar tareas de la categoría
        const tareas = await TareaGrupo.find({id_categoria_grupo : id_categoria});

        if (!tareas || tareas.length === 0) {
            return res.status(404).json({ message: "No se encontraron tareas para esta categoría" });
        }

        res.status(200).json(tareas);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar las tareas"});
    }
})