const {Schema, model} = require('mongoose')

const tareaSchema = new Schema({
    nombre: String,
    descripcion: String,
    fecha_vencimiento: Date,
    fecha_creacion: Date,
    finalizada: Boolean,
    id_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }, 
    id_categoria: { type: Schema.Types.ObjectId, ref: 'Categoria' }, // Referencia a la categoría    
        
},
{
    timestamps: true
})

module.exports = model('Tarea', productoSchema)