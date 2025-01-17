import { Schema, model } from 'mongoose'

const tareaMiembroSchema = new Schema({
    id_tarea_grupo: {type: Schema.Types.ObjectId, ref: 'TareaGrupo' },
    id_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
},
{
    timestamps: true
})

export default model('TareaMiembro', tareaMiembroSchema)