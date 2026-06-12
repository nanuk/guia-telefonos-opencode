const API = '/api/contactos';
const form = document.getElementById('contactForm');
const formTitle = document.getElementById('formTitle');
const contactId = document.getElementById('contactId');
const nombre = document.getElementById('nombre');
const apellido = document.getElementById('apellido');
const sobrenombre = document.getElementById('sobrenombre');
const numero = document.getElementById('numero');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const tbody = document.getElementById('contactsBody');

let editing = false;

function msg(text, type) {
  const el = document.createElement('div');
  el.className = `msg ${type}`;
  el.textContent = text;
  form.parentNode.insertBefore(el, form);
  setTimeout(() => el.remove(), 3000);
}

async function loadContacts() {
  const res = await fetch(API);
  const data = await res.json();
  tbody.innerHTML = data.map(c => `
    <tr>
      <td>${c.id}</td>
      <td>${c.nombre}</td>
      <td>${c.apellido}</td>
      <td>${c.sobrenombre || '-'}</td>
      <td>${c.numero}</td>
      <td class="actions">
        <button class="edit" onclick="editContact(${c.id})">Editar</button>
        <button class="danger" onclick="deleteContact(${c.id})">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

function resetForm() {
  form.reset();
  contactId.value = '';
  editing = false;
  formTitle.textContent = 'Nuevo contacto';
  saveBtn.textContent = 'Guardar';
  cancelBtn.style.display = 'none';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {
    nombre: nombre.value.trim(),
    apellido: apellido.value.trim(),
    sobrenombre: sobrenombre.value.trim() || undefined,
    numero: numero.value.trim(),
  };
  const id = contactId.value;
  const url = id ? `${API}/${id}` : API;
  const method = id ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    msg(err.error || 'Error al guardar', 'error');
    return;
  }

  msg(id ? 'Contacto actualizado' : 'Contacto creado', 'success');
  resetForm();
  loadContacts();
});

cancelBtn.addEventListener('click', resetForm);

async function editContact(id) {
  const res = await fetch(`${API}/${id}`);
  const c = await res.json();
  contactId.value = c.id;
  nombre.value = c.nombre;
  apellido.value = c.apellido;
  sobrenombre.value = c.sobrenombre || '';
  numero.value = c.numero;
  editing = true;
  formTitle.textContent = 'Editar contacto';
  saveBtn.textContent = 'Actualizar';
  cancelBtn.style.display = 'inline-block';
}

async function deleteContact(id) {
  if (!confirm('¿Eliminar este contacto?')) return;
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json();
    msg(err.error || 'Error al eliminar', 'error');
    return;
  }
  msg('Contacto eliminado', 'success');
  loadContacts();
}

loadContacts();
