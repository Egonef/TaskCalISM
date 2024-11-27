import { Schema, model } from 'mongoose'

const categoriaGrupoSchema = new Schema({
    nombre: String,
    descripcion: String,
    id_grupo: { type: Schema.Types.ObjectId, ref: 'Grupo' }, 
     
},
{
    timestamps: true
})

export default model('CategoriaGrupo', categoriaGrupoSchema)