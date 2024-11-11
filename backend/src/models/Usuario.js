const {Schema, model} = require('mongoose')

const usuarioSchema = new Schema({
    nombre_usuario: String,
    nombre: String,
    apellido: String,
    id_calendario: String,
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

module.exports = model('Usuario', usuarioSchema)