// usuarios.js - Manejo de usuarios

// Elementos del DOM
const usuariosTableBody = document.getElementById('usuarios-table-body');
const usuarioForm = document.getElementById('usuario-form');
const usuarioIdInput = document.getElementById('usuario-id');
const usuarioUsernameInput = document.getElementById('usuario-username');
const usuarioEmailInput = document.getElementById('usuario-email');
const usuarioModal = new bootstrap.Modal(document.getElementById('usuarioModal'));
const usuarioModalLabel = document.getElementById('usuarioModalLabel');
const usuarioSubmitBtn = document.getElementById('usuario-submit');

// Función para cargar usuarios
async function loadUsuarios() {
    try {
        const usuarios = await fetchAPI('/usuarios');
        displayUsuarios(usuarios);
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        showNotification('Error al cargar los usuarios', 'error');
    }
}

// Función para mostrar usuarios en la tabla
function displayUsuarios(usuarios) {
    usuariosTableBody.innerHTML = '';
    
    if (!usuarios || usuarios.length === 0) {
        usuariosTableBody.innerHTML = '<tr><td colspan="4" class="text-center">No hay usuarios disponibles</td></tr>';
        return;
    }
    
    usuarios.forEach(usuario => {
        const row = document.createElement('tr');
        const id = usuario._id || usuario.id;
        row.innerHTML = `
            <td>${id}</td>
            <td>${usuario.username}</td>
            <td>${usuario.email}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-primary edit-usuario" data-id="${id}" data-bs-toggle="tooltip" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-usuario" data-id="${id}" data-bs-toggle="tooltip" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        usuariosTableBody.appendChild(row);
    });
    
    // Activar tooltips
    const tooltips = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltips.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.edit-usuario').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            editUsuario(id);
        });
    });
    
    document.querySelectorAll('.delete-usuario').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            deleteUsuario(id);
        });
    });
}

// Función para abrir el modal de creación de usuario
function openCreateUsuarioModal() {
    resetUsuarioForm();
    usuarioModalLabel.textContent = 'Crear Nuevo Usuario';
    usuarioSubmitBtn.textContent = 'Crear';
    usuarioModal.show();
}

// Función para editar un usuario
async function editUsuario(id) {
    try {
        const usuario = await fetchAPI(`/usuarios/${id}`);
        
        usuarioIdInput.value = usuario._id || usuario.id;
        usuarioUsernameInput.value = usuario.username;
        usuarioEmailInput.value = usuario.email;
        
        usuarioModalLabel.textContent = 'Editar Usuario';
        usuarioSubmitBtn.textContent = 'Actualizar';
        usuarioModal.show();
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        showNotification('Error al obtener los datos del usuario', 'error');
    }
}

// Función para eliminar un usuario
async function deleteUsuario(id) {
    if (!id) {
        showNotification('ID de usuario no válido', 'error');
        return;
    }
    
    if (!confirm('¿Está seguro que desea eliminar este usuario?')) {
        return;
    }
    
    try {
        await fetchAPI(`/usuarios/${id}`, 'DELETE');
        showNotification('Usuario eliminado correctamente');
        loadUsuarios();
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        showNotification('Error al eliminar el usuario', 'error');
    }
}

// Función para guardar un usuario (crear o actualizar)
async function saveUsuario(event) {
    event.preventDefault();
    
    const username = usuarioUsernameInput.value.trim();
    const email = usuarioEmailInput.value.trim();
    
    if (!username || !email) {
        showNotification('Todos los campos son obligatorios', 'warning');
        return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('El formato del correo electrónico no es válido', 'warning');
        return;
    }
    
    const id = usuarioIdInput.value;
    const isEditing = id !== '';
    
    try {
        if (isEditing) {
            // Actualizar usuario existente
            await fetchAPI(`/usuarios/${id}`, 'PUT', { username, email });
            showNotification('Usuario actualizado correctamente');
        } else {
            // Crear nuevo usuario
            await fetchAPI('/usuarios', 'POST', { username, email });
            showNotification('Usuario creado correctamente');
        }
        
        usuarioModal.hide();
        loadUsuarios();
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        let errorMsg = 'Error al guardar el usuario';
        
        if (error.response && error.response.data && error.response.data.error) {
            errorMsg += ': ' + error.response.data.error;
        }
        
        showNotification(errorMsg, 'error');
    }
}

// Función para resetear el formulario
function resetUsuarioForm() {
    usuarioForm.reset();
    usuarioIdInput.value = '';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    if (usuarioForm) {
        usuarioForm.addEventListener('submit', saveUsuario);
    }
    
    const createUsuarioBtn = document.getElementById('create-usuario-btn');
    if (createUsuarioBtn) {
        createUsuarioBtn.addEventListener('click', openCreateUsuarioModal);
    }
    
    // Cargar usuarios al inicializar
    if (document.getElementById('usuarios-section')) {
        loadUsuarios();
    }
});
