import Usuario from '../models/Usuario.js'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'
const saltRounds = 10;

// Tus rutas van aquí
    // GETS GENERICOS

//error 404: no se ha encontrado; error 409: conflicto

///api/users
export const getUsers = asyncHandler(async(req, res) => {
    try{
        const users = await Usuario.find({})
        res.status(200).json(users)

    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

export const createUser = asyncHandler(async(req, res) => {

    const { nombre_usuario, nombre, contraseña, fecha_nacimiento} = req.body;

    try {
        const usuarioExistente = await Usuario.findOne({ nombre_usuario });
        if (usuarioExistente) {
            return res.status(409).json({ message: "El nombre de usuario ya está en uso" });
        }

        const contraseña_hashed = await bcrypt.hash(contraseña, saltRounds);

        const newUsu = new Usuario({
            nombre_usuario,
            nombre,
            contraseña: contraseña_hashed,
            fecha_nacimiento,
        });

        await newUsu.save();
        res.status(200).json({ message: "El usuario ha sido creado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


/*export const deleteUser = asyncHandler(async(req, res) => {
    try {
        const usuario = await Usuario.findByIdAndDelete(req.params.id);

        if(!usuario){
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({ message: 'El usuario ha sido eliminado' });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})*/

export const updateUser = asyncHandler(async(req, res) => {
    
    const { nombre_usuario, nombre, contraseña, fecha_nacimiento} = req.body;

    try {
        let updateData = {
            nombre_usuario,
            nombre,
            fecha_nacimiento,
        };


        // Solo actualizar la contraseña si se pasa en el cuerpo de la solicitud
        if (contraseña) {
            const contraseña_hashed = await bcrypt.hash(contraseña, saltRounds);
            updateData.contraseña = contraseña_hashed;
        }
        
        // Intentar encontrar y actualizar el usuario
        const usuario = await Usuario.findByIdAndUpdate(req.params.id, updateData, { new: true });
        
        // Si el usuario no se encuentra, devolver 404
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Devolver éxito si se actualizó el usuario
        res.status(200).json({ message: 'El usuario ha sido actualizado', usuario });
    } catch (error) {
        // Manejar cualquier otro error
        //console.log(error);
        res.status(500).json({ message: "Error al actualizar el usuario", error });
        
    }
})

/*export const loginUser = asyncHandler(async(req, res) => {

    const { nombre_usuario, contraseña } = req.body;
    try {
        const usuario = await Usuario.findOne({ nombre_usuario });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario incorrecto' });
        }

        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!contraseñaValida) {
            return res.status(409).json({ message: 'Credenciales incorrectas' });
        }

        req.session.usuarioId = usuario._id.toString();

        res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

export const logoutUser = asyncHandler(async(req, res) => {
    try {
        const usuarioId = req.session.usuarioId; // Almacena el ID del usuario antes de destruir la sesión

        req.session.destroy(async (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al cerrar sesión' });
            }

            const usuario = await Usuario.findById(usuarioId); // Utiliza el ID almacenado
            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            res.clearCookie('connect.sid');
            res.status(200).json({ message: 'Sesión cerrada exitosamente' });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}) */

export const acceptInvitationGroup = asyncHandler(async(req, res) => {

    const {id_usuario , id_grupo} = req.body


})
