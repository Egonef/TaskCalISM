const {Schema, model} = require('mongoose')

const categoriaGrupoSchema = new Schema({
    nombre: String,
    descripcion: String,
    id_grupo: { type: Schema.Types.ObjectId, ref: 'Grupo' }, 
     
},
{
    timestamps: true
})

module.exports = model('CategoriaGrupo', categoriaGrupoSchema)