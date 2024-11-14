import { Schema, model } from 'mongoose'

const usuarioSchema = new Schema({
    id_tarea_grupo: [
        {
            tarea_grupo: { type: Schema.Types.ObjectId, ref: 'TareaGrupo' },
        }
    ],
    id_usuario: [
        {
            tarea_grupo: { type: Schema.Types.ObjectId, ref: 'Usuario' },
        }
    ],
        
},
{
    timestamps: true
})

export default model('Usuario', usuarioSchema)