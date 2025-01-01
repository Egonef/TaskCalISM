import { Schema, model } from 'mongoose'

const usuarioSchema = new Schema({
    nombre_usuario: String,
    nombre: String,
    contraseña: String,
    fecha_nacimiento: Date,
    id_grupos: [
        {
            grupo: { type: Schema.Types.ObjectId, ref: 'Grupo' },
        }
    ],
        
},
{
    timestamps: true
})

export default model('Usuario', usuarioSchema)