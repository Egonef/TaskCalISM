import { Schema, model } from 'mongoose'

const categoriaUsuarioSchema = new Schema({
    nombre: String,
    descripcion: String,
    id_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }, 
     
},
{
    timestamps: true
})

export default model('CategoriaUsuario', categoriaUsuarioSchema)