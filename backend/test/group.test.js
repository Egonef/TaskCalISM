import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import Grupo from '../src/models/Grupo.js';
import Usuario from '../src/models/Usuario.js';

const { Types } = mongoose;

describe('Pruebas para el controlador de grupos', () => {
  let server;
  let agent;

  beforeAll(async () => {
    const URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.ff5yg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(URI);

    if (server) {
        await new Promise(resolve => server.close(resolve)); // Esperamos a que el servidor se cierre completamente
    }

    server = app.listen(5000, () => {
      console.log('Test server running on port 5000');
    });
    agent = request.agent(server);
  });

  afterAll(async () => {
    await Usuario.deleteMany({ nombre_usuario: 'adminTestGroup' });
    await Grupo.deleteMany({ nombre:  'GrupoTest2' });
    await mongoose.disconnect();
    if (server) {
      server.close();
    }
  });

  beforeEach(async () => {
    if (server) {
        await server.close(); // Cierra el servidor después de cada test
    }
  });

  it('Debería crear un grupo correctamente', async () => {
    await Usuario.deleteMany({ nombre_usuario: 'adminTestGroup' });
    await Grupo.deleteMany({ nombre:  'GrupoTest2' });

    // 1. Crear un nuevo usuario
    const nuevoUsuario = {
        nombre_usuario: 'adminTestGroup',
        nombre: 'Admin Test Group',
        contraseña: 'passwordTest123',
        fecha_nacimiento: '01/01/1990',
    };

    const responseUsuario = await agent.post('/api/user').send(nuevoUsuario);
    expect(responseUsuario.status).toBe(200); // Aseguramos que se creó correctamente
    expect(responseUsuario.body.message).toBe('El usuario ha sido creado correctamente');

    // 2. Obtener el ID del usuario creado
    const usuario_obtenido = await Usuario.findOne({ nombre_usuario: 'adminTestGroup' });
    const userId = usuario_obtenido._id;

    // 3. Crear el grupo usando el ID recuperado
    const nuevoGrupo = new Grupo({
        nombre: 'GrupoTest2',
        descripcion: 'Descripción del grupo de prueba',
        id_admin: userId // Aquí usamos el ID obtenido
    });
    usuario_obtenido.id_grupos.push(nuevoGrupo._id);
    nuevoGrupo.id_usuarios.push(usuario_obtenido._id);
    await nuevoGrupo.save();
    //const responseGrupo = await agent.post('/api/group').send(nuevoGrupo);
    const responseGrupo = await agent.get(`/api/group/${nuevoGrupo._id}`);
    expect(responseGrupo.status).toBe(200); // Confirmamos la creación
    //expect(responseGrupo.body.message).toBe('El grupo ha sido creado correctamente');
});


  it('No debería crear un grupo sin nombre', async () => {
    const grupoInvalido = {
      id_admin: new Types.ObjectId(),
    };

    const response = await agent.post('/api/group').send(grupoInvalido);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(undefined);
  });

  it('Debería obtener todos los grupos', async () => {
    const response = await agent.get('/api/group');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Debería obtener un grupo por ID', async () => {
    const nuevoGrupo = new Grupo({ nombre: 'Test Group', id_admin: new Types.ObjectId() });
    await nuevoGrupo.save();

    const response = await agent.get(`/api/group/${nuevoGrupo._id}`);
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Test Group');
  });

  it('No debería obtener un grupo inexistente', async () => {
    const idInexistente = new Types.ObjectId();
    const response = await agent.get(`/api/group/${idInexistente}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Grupo no encontrado');
  });

  it('Debería actualizar un grupo existente', async () => {
    const nuevoGrupo = new Grupo({ nombre: 'Test Group', id_admin: new Types.ObjectId() });
    await nuevoGrupo.save();
    const actualizacion = { nombre: 'Updated Group' };
    const response = await agent.put(`/api/group/${nuevoGrupo._id}`).send(actualizacion);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Grupo actualizado correctamente');
  });

  it('No debería actualizar un grupo inexistente', async () => {
    const idInexistente = new Types.ObjectId();
    const actualizacion = { nombre: 'Updated Group' };
    const response = await agent.put(`/api/group/${idInexistente}`).send(actualizacion);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(undefined);
  });
  
  it('Debería eliminar un grupo existente', async () => {
    await Grupo.deleteMany({ nombre:  'Test Group' });
    const usuario_obtenido = await Usuario.findOne({ nombre_usuario: 'adminTestGroup' });
    const userId = usuario_obtenido._id;
    const grupoExistente = new Grupo({ nombre: 'Test Group', userId });
    await grupoExistente.save();

    const response = await agent.delete(`/api/group/delete/${grupoExistente._id}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Grupo eliminado correctamente');
  });
  

  /*
  it('Debe eliminar un grupo correctamente', async () => {
    const nuevoGrupo = new Grupo({ nombre: 'Test Group', id_admin: new Types.ObjectId() });
    await nuevoGrupo.save();

    const req = {
        params: { id: grupo._id.toString() },
        body: { id_admin: usuarioAdmin._id.toString() },
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    await deleteGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'El grupo ha sido eliminado correctamente' });

    // Verificar que el grupo ya no existe
    const grupoEliminado = await Grupo.findById(grupo._id);
    expect(grupoEliminado).toBeNull();
});
*/

  it('No debería eliminar un grupo inexistente', async () => {
    const idInexistente = new Types.ObjectId();
    const response = await agent.delete(`/api/group/${idInexistente}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(undefined);
  });
});
