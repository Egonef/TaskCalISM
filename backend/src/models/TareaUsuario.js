import { Schema, model } from 'mongoose'

const tareaUsuarioSchema = new Schema({
    nombre: String,
    descripcion: String,
    fecha_vencimiento: Date,
    estado: Boolean,
    id_categoria_usuario: { type: Schema.Types.ObjectId, ref: 'CategoriaUsuario' }, // Referencia a la categoría
},
{
    timestamps: true
})

export default model('tareaUsuario', tareaUsuarioSchema)
