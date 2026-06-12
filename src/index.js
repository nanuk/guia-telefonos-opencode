const express = require('express');
require('dotenv').config();

const contactsRouter = require('./routes/contacts');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('frontend'));
app.use('/api/contactos', contactsRouter);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Microservicio corriendo en el puerto ${PORT}`);
  });
}

module.exports = app;
