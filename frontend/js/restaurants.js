// restaurants.js - Manejo de restaurantes

// Elementos del DOM
const restaurantsTableBody = document.getElementById('restaurants-table-body');
const restaurantForm = document.getElementById('restaurant-form');
const restaurantIdInput = document.getElementById('restaurant-id');
const restaurantNameInput = document.getElementById('restaurant-name');
const restaurantAddressInput = document.getElementById('restaurant-address');
const restaurantReputationInput = document.getElementById('restaurant-reputation');
const restaurantUrlInput = document.getElementById('restaurant-url');
const restaurantModal = new bootstrap.Modal(document.getElementById('restaurantModal'));

// Función para cargar restaurantes
async function loadRestaurants() {
    try {
        const restaurants = await fetchAPI('/restaurantes');
        displayRestaurants(restaurants);
        updateRestaurantDropdowns();
    } catch (error) {
        console.error('Error al cargar restaurantes:', error);
    }
}

// Función para mostrar restaurantes en la tabla
function displayRestaurants(restaurants) {
    restaurantsTableBody.innerHTML = '';
    
    if (!restaurants || restaurants.length === 0) {
        restaurantsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No hay restaurantes disponibles</td></tr>';
        return;
    }
    
    restaurants.forEach(restaurant => {
        const row = document.createElement('tr');
        const id = restaurant._id || restaurant.id || 'undefined';
        row.innerHTML = `
            <td>${id}</td>
            <td>${restaurant.nombre}</td>
            <td>${restaurant.direccion}</td>
            <td>${restaurant.reputacion || 'N/A'} ★</td>
            <td><a href="${restaurant.url || '#'}" target="_blank">${restaurant.url ? 'Ver sitio' : 'N/A'}</a></td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-primary edit-restaurant" data-id="${id}">
                    <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-sm btn-danger delete-restaurant" data-id="${id}">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </td>
        `;
        restaurantsTableBody.appendChild(row);
    });
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.edit-restaurant').forEach(button => {
        button.addEventListener('click', (e) => editRestaurant(e.target.dataset.id));
    });
    
    document.querySelectorAll('.delete-restaurant').forEach(button => {
        button.addEventListener('click', (e) => deleteRestaurant(e.target.dataset.id));
    });
}

// Función para actualizar los dropdowns de restaurantes
function updateRestaurantDropdowns() {
    const restaurantSelects = document.querySelectorAll('#relation-restaurant');
    
    fetchAPI('/restaurantes')
        .then(restaurants => {
            restaurantSelects.forEach(select => {
                // Guardar el valor seleccionado actualmente
                const currentValue = select.value;
                
                // Vaciar el select excepto la primera opción
                const firstOption = select.options[0];
                select.innerHTML = '';
                select.appendChild(firstOption);
                
                // Agregar las nuevas opciones
                restaurants.forEach(restaurant => {
                    const option = document.createElement('option');
                    // Use _id or id, whichever is available
                    option.value = restaurant._id || restaurant.id;
                    option.textContent = restaurant.nombre;
                    select.appendChild(option);
                });
                
                // Restaurar el valor seleccionado si existe
                if (currentValue) {
                    select.value = currentValue;
                }
            });
        })
        .catch(error => console.error('Error al actualizar dropdowns de restaurantes:', error));
}

// Función para crear o actualizar un restaurante
async function saveRestaurant(event) {
    event.preventDefault();
    
    // Validación básica
    if (!restaurantNameInput.value || !restaurantAddressInput.value || !restaurantUrlInput.value) {
        showNotification('Todos los campos son obligatorios', 'danger');
        return;
    }
    
    // Validación de URL
    const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[^\s]*)?(\?[^\s]*)?$/i;
    if (!urlPattern.test(restaurantUrlInput.value)) {
        showNotification('La URL proporcionada no es válida', 'danger');
        return;
    }
    
    const restaurantData = {
        nombre: restaurantNameInput.value.trim(),
        direccion: restaurantAddressInput.value.trim(),
        reputacion: parseInt(restaurantReputationInput.value) || 3,
        url: restaurantUrlInput.value.trim()
    };
    
    const restaurantId = restaurantIdInput.value;
    
    try {
        // Mostrar notificación de carga
        showNotification('Guardando información...', 'info');
        
        let result;
        if (restaurantId) {
            // Actualizar restaurante existente
            result = await fetchAPI(`/restaurantes/${restaurantId}`, 'PUT', restaurantData);
            showNotification('Restaurante actualizado correctamente', 'success');
        } else {
            // Crear nuevo restaurante
            result = await fetchAPI('/restaurantes', 'POST', restaurantData);
            showNotification('Restaurante creado correctamente', 'success');
        }
        
        console.log('Respuesta del servidor:', result);
        
        // Cerrar modal y recargar datos
        restaurantModal.hide();
        resetRestaurantForm();
        loadRestaurants();
    } catch (error) {
        console.error('Error al guardar restaurante:', error);
        // La notificación de error ya la maneja fetchAPI
    }
}

// Función para editar un restaurante
async function editRestaurant(id) {
    try {
        const restaurant = await fetchAPI(`/restaurantes/${id}`);
        
        // Use _id or id, whichever is available
        restaurantIdInput.value = restaurant._id || restaurant.id;
        restaurantNameInput.value = restaurant.nombre;
        restaurantAddressInput.value = restaurant.direccion;
        restaurantReputationInput.value = restaurant.reputacion || 3;
        restaurantUrlInput.value = restaurant.url || '';
        
        document.getElementById('restaurantModalLabel').textContent = 'Editar Restaurante';
        restaurantModal.show();
    } catch (error) {
        console.error('Error al obtener datos del restaurante:', error);
    }
}

// Función para eliminar un restaurante
async function deleteRestaurant(id) {
    if (!confirm('¿Está seguro de eliminar este restaurante?')) {
        return;
    }
    
    try {
        await fetchAPI(`/restaurantes/${id}`, 'DELETE');
        showNotification('Restaurante eliminado correctamente');
        loadRestaurants();
    } catch (error) {
        console.error('Error al eliminar restaurante:', error);
    }
}

// Función para resetear el formulario
function resetRestaurantForm() {
    restaurantForm.reset();
    restaurantIdInput.value = '';
    restaurantReputationInput.value = 3; // Establecer un valor predeterminado
    restaurantUrlInput.value = ''; 
    document.getElementById('restaurantModalLabel').textContent = 'Agregar Restaurante';
}

// Event listeners
restaurantForm.addEventListener('submit', saveRestaurant);

document.getElementById('add-restaurant-btn').addEventListener('click', () => {
    resetRestaurantForm();
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadRestaurants();
});
