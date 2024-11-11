const {Schema, model} = require('mongoose')

const grupoSchema = new Schema({
    nombre: String,
    fecha_creacion: Date,
    descripcion: String,
    id_usuarios: [
        {
            usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
            privilegio: Number,
            rol: { type: String, enum: ['usuario', 'admin'] },
        }
    ],
        
},
{
    timestamps: true
})

module.exports = model('Grupo', usuarioSchema)