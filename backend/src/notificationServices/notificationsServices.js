import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import Notificacion from '../models/Notificacion.js';
import Usuario from '../models/Usuario.js';


import { fileURLToPath } from 'url';
import asyncHandler from 'express-async-handler'


// Configurar __dirname para ESM
//const __filename = '';
//console.log(`Primero: ${__filename}`);
//const __dirname = path.dirname('./notificationTemplates');
//console.log(`Segundo: ${__dirname}`);

const templatesDir = path.resolve('src/notificationTemplates');
//console.log(`Tercero: ${templatesDir}`);


// Función para cargar y renderizar una plantilla
async function generarNotificacion(tipo, datos, usuario) {
  console.log(`Entrando en la funcion que genera las notificaciones`)
  try {
     // Ruta de la plantilla
    const templatePath = path.join(templatesDir, `${tipo}.hbs`);
    console.log(templatePath);

    console.log(tipo);
    
     // Verificar si el archivo existe
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Plantilla para el tipo "${tipo}" no encontrada`);
    }
 
    // Cargar y compilar la plantilla
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);

    // Renderizar la plantilla con datos
    const content = template(datos);
    let notificacion = []
    //const usuario = await Usuario.findById(idusuario);

    // Crear y guardar la notificación en la base de datos
    if (tipo === 'bienvenida'){
      notificacion = new Notificacion({
        titulo: `Bienvenid@`, // Puedes personalizar el título según el tipo
        descripcion: content,
        leida: false,
        id_usuario: usuario,
      });

      const notificacionExistente = await Notificacion.findOne({ titulo: notificacion.titulo, id_usuario: usuario });
      //console.log(notificacionExistente);
      if (notificacionExistente) {
        throw new Error('La notificación ya existe' );
      }
      console.log(`NOTIFICACION A CONTINUACION: ${notificacion}`)
      await notificacion.save();
      console.log(`Notificacion guardada`)
    }

    if (tipo === 'tareaPendienteHoy' || tipo === 'asignacionATareaGrupo'){
      if(tipo === 'tareaPendienteHoy'){
        notificacion = new Notificacion({
          titulo: `Tareas Pendientes de Hoy`,
          descripcion: content,
          leida: false,
          id_usuario: usuario._id,
        });
      } else{
        notificacion = new Notificacion({
          titulo: `Asignación a Tarea de Grupo`,
          descripcion: content,
          leida: false,
          id_usuario: usuario,
        });
      }

      console.log(`NOTIFICACION A CONTINUACION: ${notificacion}`)
      await notificacion.save();
    }

    if (tipo === 'tareasPendientesHoy'){
      notificacion = new Notificacion({
        titulo: `Tareas Pendientes de Hoy`,
        descripcion: content,
        leida: false,
        id_usuario: usuario,
      });
      await notificacion.save();
    }

    if(tipo == 'invitacionAGrupo'){
      const { id_grupo } = datos;
      console.log("Id del usuario a invitar para debuggear: ", usuario);
      notificacion = new Notificacion({
        titulo: `Invitacion a Grupo`,
        descripcion: content,
        leida: false,
        id_usuario: usuario,
        id_grupo
      });
      await notificacion.save();
      console.log(`Invitao`)
    }
  } catch (error) {
    console.error(`Error al generar la notificación: ${error.message}`);
    throw error; // Propaga el error al controlador
  }
}

// Exportación de la función
export { generarNotificacion };
