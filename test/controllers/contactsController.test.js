const mockQuery = jest.fn();
jest.mock('../../src/db', () => ({ query: mockQuery }));

const { getAll, getById, create, update, remove } = require('../../src/controllers/contactsController');

describe('contactsController', () => {
  let req, res;

  beforeEach(() => {
    mockQuery.mockReset();
    req = { params: {}, body: {} };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('getAll', () => {
    it('debe retornar todos los contactos', async () => {
      const fakeRows = [{ id: 1, nombre: 'Juan', apellido: 'Pérez', numero: '123456789' }];
      mockQuery.mockResolvedValue({ rows: fakeRows });

      await getAll(req, res);

      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM contactos ORDER BY id');
      expect(res.json).toHaveBeenCalledWith(fakeRows);
    });
  });

  describe('getById', () => {
    it('debe retornar un contacto por id', async () => {
      req.params.id = '1';
      const fakeRow = { id: 1, nombre: 'Juan', apellido: 'Pérez', numero: '123456789' };
      mockQuery.mockResolvedValue({ rows: [fakeRow] });

      await getById(req, res);

      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM contactos WHERE id = $1', ['1']);
      expect(res.json).toHaveBeenCalledWith(fakeRow);
    });

    it('debe retornar 404 si el contacto no existe', async () => {
      req.params.id = '999';
      mockQuery.mockResolvedValue({ rows: [] });

      await getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Contacto no encontrado' });
    });
  });

  describe('create', () => {
    it('debe crear un contacto nuevo', async () => {
      req.body = { nombre: 'Ana', apellido: 'López', numero: '987654321' };
      const fakeRow = { id: 2, ...req.body };
      mockQuery.mockResolvedValue({ rows: [fakeRow] });

      await create(req, res);

      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO contactos (nombre, apellido, numero) VALUES ($1, $2, $3) RETURNING *',
        ['Ana', 'López', '987654321']
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeRow);
    });

    it('debe retornar 400 si faltan campos requeridos', async () => {
      req.body = { nombre: 'Ana' };

      await create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'nombre, apellido y numero son requeridos' });
    });
  });

  describe('update', () => {
    it('debe actualizar un contacto existente', async () => {
      req.params.id = '1';
      req.body = { nombre: 'Juan', apellido: 'Pérez', numero: '111111111' };
      const fakeRow = { id: 1, ...req.body };
      mockQuery.mockResolvedValue({ rows: [fakeRow] });

      await update(req, res);

      expect(mockQuery).toHaveBeenCalledWith(
        'UPDATE contactos SET nombre = $1, apellido = $2, numero = $3 WHERE id = $4 RETURNING *',
        ['Juan', 'Pérez', '111111111', '1']
      );
      expect(res.json).toHaveBeenCalledWith(fakeRow);
    });

    it('debe retornar 404 si el contacto a actualizar no existe', async () => {
      req.params.id = '999';
      req.body = { nombre: 'Test', apellido: 'Test', numero: '000000000' };
      mockQuery.mockResolvedValue({ rows: [] });

      await update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Contacto no encontrado' });
    });

    it('debe retornar 400 si faltan campos en actualización', async () => {
      req.params.id = '1';
      req.body = { nombre: 'Ana' };

      await update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'nombre, apellido y numero son requeridos' });
    });
  });

  describe('remove', () => {
    it('debe eliminar un contacto existente', async () => {
      req.params.id = '1';
      mockQuery.mockResolvedValue({ rows: [{ id: 1 }] });

      await remove(req, res);

      expect(mockQuery).toHaveBeenCalledWith('DELETE FROM contactos WHERE id = $1 RETURNING *', ['1']);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Contacto eliminado' });
    });

    it('debe retornar 404 si el contacto a eliminar no existe', async () => {
      req.params.id = '999';
      mockQuery.mockResolvedValue({ rows: [] });

      await remove(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Contacto no encontrado' });
    });
  });
});
