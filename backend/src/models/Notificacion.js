import { Schema, model } from 'mongoose'

const NotificacionSchema = new Schema({
    titulo: String,
    descripcion: String,
    leida: Boolean, //true si ya fue leida, false si no, y si ya fue leida podriamos eliminarla
    id_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }, 
    id_notificador: { type: Schema.Types.ObjectId, ref: 'Usuario' } // Para validar las invitaciones
},
{
    timestamps: true
})

export default model('Notificacion', NotificacionSchema)