import { Schema, model } from 'mongoose'

const tareaGrupoSchema = new Schema({
    nombre: String,
    descripcion: String,
    fecha_vencimiento: Date,
    estado: Boolean,
    id_categoria_grupo: { type: Schema.Types.ObjectId, ref: 'CategoriaGrupo' }, // Referencia a la categoría    
        
},
{
    timestamps: true
})

export default model('TareaGrupo', tareaGrupoSchema)

