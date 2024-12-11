import Usuario from '../models/Usuario.js'
import Grupo from '../models/Grupo.js'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'
const saltRounds = 10;

// Tus rutas van aquí
    // GETS GENERICOS

//error 404: no se ha encontrado; error 409: conflicto

///api/users
export const getUsers = asyncHandler(async(req, res) => { //NO TIENE CU
    try{
        const users = await Usuario.find({})
        res.status(200).json(users)

    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

export const getUser = asyncHandler(async(req, res) => { //CU01
    
    try{
        const user = await Usuario.findById(req.params.id);
        if(user)
            res.status(200).json(user)
        else
            res.status(404).json({ message: "Usuario no encontrado" });

    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

export const createUser = asyncHandler(async(req, res) => { //CU23

    const { nombre_usuario, nombre, contraseña, fecha_nacimiento } = req.body;

    try {
        const usuarioExistente = await Usuario.findOne({ nombre_usuario });
        if (usuarioExistente) {
            return res.status(409).json({ message: "Este usuario ya existe" });
        }

        const contraseña_hashed = await bcrypt.hash(contraseña, saltRounds);
        const id_calendario = "0"; //Provisional

        const newUsu = new Usuario({
            nombre_usuario,
            nombre,
            id_calendario,
            contraseña: contraseña_hashed,
            fecha_nacimiento,
            id_grupos: []
        });

        await newUsu.save();
        res.status(200).json({ message: "El usuario ha sido creado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


export const modifyUser = asyncHandler(async(req, res) => { //CU02
    
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
        res.status(500).json({ message: error.message });
        
    }
})

/*export const loginUser = asyncHandler(async(req, res) => { //CU24

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

export const logoutUser = asyncHandler(async(req, res) => { //CU25
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

export const acceptInvitationGroup = asyncHandler(async(req, res) => { //CU06

    const {nombre_usuario} = req.body

    try {
        const usuario = await Usuario.findOne({nombre_usuario});
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const grupo = await Grupo.findById(req.params.grupo);
        if (!grupo) {
            return res.status(404).json({ message: 'Grupo no encontrado' });
        }

        
        if (grupo.id_admin.equals(usuario._id)) {
            return res.status(409).json({ message: 'El usuario ya está en el grupo' });
        }
        usuario.id_grupos.push(grupo);
        await usuario.save();


        grupo.id_usuarios.push(usuario);
        await grupo.save();

        res.status(200).json({ message: 'Invitación aceptada correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

})
