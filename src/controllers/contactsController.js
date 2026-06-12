const pool = require('../db');

exports.getAll = async (req, res) => {
  const result = await pool.query('SELECT * FROM contactos ORDER BY id');
  res.json(result.rows);
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM contactos WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Contacto no encontrado' });
  }
  res.json(result.rows[0]);
};

exports.create = async (req, res) => {
  const { nombre, apellido, numero } = req.body;
  if (!nombre || !apellido || !numero) {
    return res.status(400).json({ error: 'nombre, apellido y numero son requeridos' });
  }
  const result = await pool.query(
    'INSERT INTO contactos (nombre, apellido, numero) VALUES ($1, $2, $3) RETURNING *',
    [nombre, apellido, numero]
  );
  res.status(201).json(result.rows[0]);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, numero } = req.body;
  if (!nombre || !apellido || !numero) {
    return res.status(400).json({ error: 'nombre, apellido y numero son requeridos' });
  }
  const result = await pool.query(
    'UPDATE contactos SET nombre = $1, apellido = $2, numero = $3 WHERE id = $4 RETURNING *',
    [nombre, apellido, numero, id]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Contacto no encontrado' });
  }
  res.json(result.rows[0]);
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM contactos WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Contacto no encontrado' });
  }
  res.json({ mensaje: 'Contacto eliminado' });
};
