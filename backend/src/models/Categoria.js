const {Schema, model} = require('mongoose')

const categoriaSchema = new Schema({
    nombre: String,
    descripcion: String,
    id_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }, 
     
},
{
    timestamps: true
})

module.exports = model('Categoria', categoriaSchema)