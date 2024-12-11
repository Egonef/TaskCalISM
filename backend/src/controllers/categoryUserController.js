import asyncHandler from 'express-async-handler'
import Usuario from '../models/Usuario.js';
import CategoriaUsuario from '../models/CategoriaUsuario.js';
import TareaUsuario from '../models/TareaUsuario.js';


/*
----------------------------------
    CATEGORIAS DE USUARIOS
    ------------------------------
*/

///api/categories/user?id_usuario=0

//CAMBIAR POR COMO ESTA EL DE GROUPS
export const getCategoriesUser = asyncHandler(async(req, res) => { //CU22

    const {id_user} = req.query

    try{

        if(!usuario){
            return res.status(404).json({ message: "Usuario no encontrado" });  
        }

        const categories = await CategoriaUsuario.find({id_usuarios: id_user})
        res.status(200).json(categories)

    }catch(error){
        res.status(500).json({ message: error.message });
    }
})


///api/categories/user
export const createCategoryUser = asyncHandler(async (req, res) => { //CU14
    const { nombre, descripcion } = req.body;

    try {
        // Verificar si el usuario asociado existe
        const usuarioExistente = await Usuario.findById(req.params.iduser);

        console.log(usuarioExistente);

        if (!usuarioExistente) {
            return res.status(404).json({ message: "El usuario no existe" });
        }

        const categoriaExistente = await CategoriaUsuario.findOne({ nombre });

        if (categoriaExistente) {
            return res.status(409).json({ message: "La categoria ya existe." });
        }
        
        // Crear una nueva categoría
        const Categoria = new CategoriaUsuario({
            nombre,
            descripcion,
            id_usuario: usuarioExistente,
        });

        // Guardar la categoría en la base de datos
        await Categoria.save();

        // Responder con éxito
        res.status(200).json({ message: "La categoría ha sido creada correctamente", categoria: Categoria });
    } catch (error) {
        // Capturar errores y enviar una respuesta adecuada
        res.status(500).json({ message: "Error al crear la categoría", error: error.message });
    }
});

///api/categories/user/modify/:id_categoria
export const modifyCategoryUser = asyncHandler(async (req, res) => { //CU20
    const { id_categoria } = req.params; // ID de la categoria a modificar
    const { nombre, descripcion} = req.body;

    try {
        // Verificar si la categoría existe
        const categoria = await CategoriaUsuario.findById(id_categoria);
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
///api/categories/user/delete/:id_categoria
export const deleteCategoryUser = asyncHandler(async (req, res) => { //CU21
    const { id_categoria } = req.params;  // ID de la categoría a eliminar

    try {
        // Buscar y eliminar la categoría por su ID
        const categoriaEliminada = await CategoriaUsuario.findByIdAndDelete(id_categoria);

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
///api/categories/user/tasks/:id_categoria
export const getTasksByCategoryUser = asyncHandler(async (req,res) => { //CU09
    const { id_categoria} = req.params;

    try {
        //Buscar tareas de la categoría
        const tareas = await TareaUsuario.find({id_categoria_usuario : id_categoria});

        if (!tareas || tareas.length === 0) {
            return res.status(404).json({ message: "No se encontraron tareas para esta categoría" });
        }

        res.status(200).json(tareas);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar las tareas"});
    }
})
