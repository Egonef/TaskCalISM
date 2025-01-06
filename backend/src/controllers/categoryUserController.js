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

    //const {id_user} = req.query

    try{

        const usuarioExistente = await Usuario.findById(req.params.idusuario);
        
        if (!usuarioExistente) {
            return res.status(404).json({ message: "Usuario no encontrado" });  
        }
        

        const categories = await CategoriaUsuario.find({id_usuario: usuarioExistente})
        if (categories.length === 0) {
            return res.status(404).json({ message: "No se encontraron categorías para este grupo" });
        }

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
        const usuarioExistente = await Usuario.findById(req.params.idusuario);

        if (!usuarioExistente) {
            return res.status(404).json({ message: "Usuario no existente" });
        }

        const categoriaExistente = await CategoriaUsuario.findOne({ id_usuario: usuarioExistente._id, nombre: nombre });

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
    //const { id_categoria } = req.params; // ID de la categoria a modificar
    const { nombre, descripcion} = req.body;

    try {
        // Verificar si la categoría existe
        const categoria = await CategoriaUsuario.findById(req.params.id);
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
    //const { id_categoria } = req.params;  // ID de la categoría a eliminar
    console.log('borrando categoria')
    try {
        // Buscar y eliminar la categoría por su ID
        const categoria = await CategoriaUsuario.findByIdAndDelete(req.params.id);

        // Verificar si la categoría fue eliminada
        if (!categoria) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        await TareaUsuario.findByIdAndDelete(categoria._id)
        
        await TareaUsuario.deleteMany({ id_categoria_usuario: req.params.id })
        // Responder con un mensaje de éxito
        res.status(200).json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la categoría", error: error.message });
    }
});
///api/categories/user/tasks/:id_categoria
export const getTasksByCategoryUser = asyncHandler(async (req,res) => { //CU09
    //const { id_categoria} = req.params;

    try {
        //Buscar tareas de la categoría
        const tareas = await TareaUsuario.find({id_categoria_usuario : req.params.id});

        if (!tareas || tareas.length === 0) {
            return res.status(404).json({ message: "No se encontraron tareas para esta categoría" });
        }

        res.status(200).json(tareas);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar las tareas"});
    }
})
