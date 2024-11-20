const {Schema, model} = require('mongoose')

const grupoSchema = new Schema({
    nombre: String,
    descripcion: String,
    id_calendario: String,
    id_admin: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    id_usuarios: [
        {
            usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
        }
    ],
        
},
{
    timestamps: true
})

module.exports = model('Grupo', grupoSchema)