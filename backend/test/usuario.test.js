import request from 'supertest'; // Usa import para supertest
import app from '../src/app.js'; // Usa import para tu app
import mongoose from 'mongoose';
import Usuario from '../src/models/Usuario.js'
import Grupo from '../src/models/Grupo.js'


const { Types } = mongoose;

const obtenerIdPorNombreUsuario = async (nombreUsuario) => {
    try {
      // Buscar el usuario por su nombre de usuario
      const usuario = await Usuario.findOne({ nombre_usuario: nombreUsuario });
      
      // Verificar si se encontró el usuario
      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }
      
      // Retornar el ObjectId del usuario encontrado
      return usuario._id;
    } catch (error) {
      throw new Error("Error al obtener el ObjectId del usuario: " + error.message);
    }
  };

describe('Pruebas para la API de usuarios', () => {
    let server;
    let agent;
    
    beforeAll(async () => {

        const URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.ff5yg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
        await mongoose.connect(URI);
  
        server = app.listen(5000, () => {
            console.log('Test server running on port 5000');
        });
        agent = request.agent(server); // Agente para manejar la sesión
  
      });
  
    afterAll(async () => {
      // Eliminar usuarios y grupos creados durante las pruebas
      await Usuario.deleteMany({ nombre_usuario: { $regex: /^test|usuario_existente|usuario_prueba/ } });
      await Grupo.deleteMany({ nombre: { $regex: /^Test Group|Grupo de prueba/ } });
      await mongoose.disconnect();
      if (server) { // Asegúrate de que 'server' esté definido
            server.close();
      }
    });

    

    it('Crear un nuevo usuario', async () => {
      const nuevoUsuario = {
        nombre_usuario: 'testuser',
        nombre: 'Test User',
        contraseña: 'testpassword',
        fecha_nacimiento: '1990-01-01',
      };
  
      const response = await agent.post('/api/user').send(nuevoUsuario);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("El usuario ha sido creado correctamente");
    });

    
    it('Crear un usuario existente', async () => {
      const usuarioExistente = {
          nombre_usuario: 'usuario_existente',
          nombre: 'Usuario Existente',
          contraseña: 'password',
          fecha_nacimiento: '2000-01-01'
      };
      await Usuario.create(usuarioExistente);

      const response = await agent.post('/api/user').send(usuarioExistente);
      expect(response.status).toBe(409);
      expect(response.body.message).toBe("Este usuario ya existe");

    });

    it('Devolver todos los usuarios', async () => {
      const response = await agent.get('/api/user');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('Obtener un usuario específico', async () => {
      const nombreUsuario = 'testuser';
      const userId = await obtenerIdPorNombreUsuario(nombreUsuario);
      const response = await agent.get(`/api/user/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body.nombre_usuario).toBe(nombreUsuario);
    });

    it('Obtener un usuario inexistente', async () => {

      const objectId = new Types.ObjectId("5f1d7f1a1e4b1a1b1c1d2f2f");
      const response = await agent.get(`/api/user/${objectId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Usuario no encontrado");
  });

    it('Actualizar un usuario existente', async () => {
      const nombreUsuario = 'testuser';
      const userId = await obtenerIdPorNombreUsuario(nombreUsuario);
      const actualizacion = {
        nombre: 'Updated User',
        contraseña: 'newpassword',
      };
  
      const response = await agent.put(`/api/user/modify/${userId}`).send(actualizacion);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("El usuario ha sido actualizado");
    }); 
  
    it('Aceptar invitación a un grupo', async () => {
      const usuario1 = await Usuario.findOne({ nombre_usuario: 'testuser' });
      const nuevoUsuario = {
        nombre_usuario: 'testuser2',
        nombre: 'Test User2',
        contraseña: 'testpassword2',
        fecha_nacimiento: '1990-01-02',
      };
      const usuario2 = await Usuario.create(nuevoUsuario);
      const grupo = new Grupo({ nombre: 'Test Group', id_admin: usuario1._id});
      usuario1.id_grupos.push(grupo._id);
      grupo.id_usuarios.push(usuario1._id);
      await grupo.save();
      const response = await agent.put(`/api/user/invitation/${grupo._id}`).send({ nombre_usuario: 'testuser2' });
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Invitación aceptada correctamente');
  
    });

    it('Aceptar una invitación para un grupo inexistente', async () => {
      const grupoId = new Types.ObjectId("5f1d7f1a1e4b1a1b1c1d2f2f");
      const response = await agent.put(`/api/user/invitation/${grupoId}`).send({nombre_usuario: 'testuser'});
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Grupo no encontrado");
    });

    it('Aceptar una invitación para un usuario inexistente', async () => {
      const datosInvitacion = {
          nombre_usuario: 'usuario_inexistente'
      };

      const grupo = await Grupo.find({nombre: 'Test Group'});
      const response = await agent.put(`/api/user/invitation/${grupo._id}`).send(datosInvitacion);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Usuario no encontrado");
    });
  
      
    it('Aceptar una invitación de un usuario que ya está en el grupo', async () => {
      const grupo = await Grupo.findOne({nombre: 'Test Group'});
      const response = await agent.put(`/api/user/invitation/${grupo._id}`).send({ nombre_usuario: 'testuser2' });
      expect(response.status).toBe(409);
      expect(response.body.message).toBe("El usuario ya está en el grupo");
    });
    
    
    
  })

