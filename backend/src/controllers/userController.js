import Usuario from '../models/Usuario.js'
import asyncHandler from 'express-async-handler'


// Tus rutas van aquí
    // GETS GENERICOS

///api/users
export const getUsers = asyncHandler(async(req, res) => {
    const users = await Usuario.find({})
    res.json(users)
})