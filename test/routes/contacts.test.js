const mockQuery = jest.fn();
jest.mock('../../src/db', () => ({ query: mockQuery }));

const request = require('supertest');
const app = require('../../src/index');

describe('GET /api/contactos', () => {
  it('debe retornar todos los contactos', async () => {
    const fakeRows = [{ id: 1, nombre: 'Juan', apellido: 'Pérez', numero: '123456789' }];
    mockQuery.mockResolvedValue({ rows: fakeRows });

    const res = await request(app).get('/api/contactos');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeRows);
  });
});

describe('GET /api/contactos/:id', () => {
  it('debe retornar un contacto por id', async () => {
    const fakeRow = { id: 1, nombre: 'Juan', apellido: 'Pérez', numero: '123456789' };
    mockQuery.mockResolvedValue({ rows: [fakeRow] });

    const res = await request(app).get('/api/contactos/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeRow);
  });

  it('debe retornar 404 si el contacto no existe', async () => {
    mockQuery.mockResolvedValue({ rows: [] });

    const res = await request(app).get('/api/contactos/999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Contacto no encontrado' });
  });
});

describe('POST /api/contactos', () => {
  it('debe crear un contacto nuevo', async () => {
    const input = { nombre: 'Ana', apellido: 'López', numero: '987654321' };
    const fakeRow = { id: 2, ...input };
    mockQuery.mockResolvedValue({ rows: [fakeRow] });

    const res = await request(app).post('/api/contactos').send(input);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(fakeRow);
  });

  it('debe retornar 400 si faltan campos', async () => {
    const res = await request(app).post('/api/contactos').send({ nombre: 'Ana' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'nombre, apellido y numero son requeridos' });
  });
});

describe('PUT /api/contactos/:id', () => {
  it('debe actualizar un contacto existente', async () => {
    const input = { nombre: 'Juan', apellido: 'Pérez', numero: '111111111' };
    const fakeRow = { id: 1, ...input };
    mockQuery.mockResolvedValue({ rows: [fakeRow] });

    const res = await request(app).put('/api/contactos/1').send(input);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeRow);
  });

  it('debe retornar 404 si el contacto no existe', async () => {
    mockQuery.mockResolvedValue({ rows: [] });

    const res = await request(app).put('/api/contactos/999').send({ nombre: 'Test', apellido: 'Test', numero: '000' });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Contacto no encontrado' });
  });

  it('debe retornar 400 si faltan campos', async () => {
    const res = await request(app).put('/api/contactos/1').send({ nombre: 'Ana' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'nombre, apellido y numero son requeridos' });
  });
});

describe('DELETE /api/contactos/:id', () => {
  it('debe eliminar un contacto existente', async () => {
    mockQuery.mockResolvedValue({ rows: [{ id: 1 }] });

    const res = await request(app).delete('/api/contactos/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ mensaje: 'Contacto eliminado' });
  });

  it('debe retornar 404 si el contacto no existe', async () => {
    mockQuery.mockResolvedValue({ rows: [] });

    const res = await request(app).delete('/api/contactos/999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Contacto no encontrado' });
  });
});
