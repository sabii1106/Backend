// relations.js - Manejo de relaciones entre restaurantes y tipos de comida

// Elementos del DOM
const relationsTableBody = document.getElementById('relations-table-body');
const relationForm = document.getElementById('relation-form');
const relationIdInput = document.getElementById('relation-id');
const relationRestaurantSelect = document.getElementById('relation-restaurant');
const relationFoodTypeSelect = document.getElementById('relation-food-type');
const relationModal = new bootstrap.Modal(document.getElementById('relationModal'));
const foodTypeFilterSelect = document.getElementById('food-type-filter');
const searchByFoodTypeBtn = document.getElementById('search-by-food-type-btn');
const restaurantsByFoodTypeResult = document.getElementById('restaurants-by-food-type-result');

// Función para cargar relaciones
async function loadRelations() {
    try {
        const relations = await fetchAPI('/menu');
        displayRelations(relations);
    } catch (error) {
        console.error('Error al cargar relaciones:', error);
    }
}

// Función para mostrar relaciones en la tabla
function displayRelations(relations) {
    relationsTableBody.innerHTML = '';
    
    if (!relations || relations.length === 0) {
        relationsTableBody.innerHTML = '<tr><td colspan="5" class="text-center">No hay relaciones disponibles</td></tr>';
        return;
    }
    
    relations.forEach(relation => {
        const row = document.createElement('tr');
        const id = relation._id || relation.id || 'undefined';
        row.innerHTML = `
            <td>${id}</td>
            <td>${relation.restaurante ? relation.restaurante.nombre : 'N/A'}</td>
            <td>${relation.tipoComida ? relation.tipoComida.nombre : 'N/A'}</td>
            <td>${new Date(relation.enrollmentDate).toLocaleDateString()}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-danger delete-relation" data-id="${id}">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </td>
        `;
        relationsTableBody.appendChild(row);
    });
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.delete-relation').forEach(button => {
        button.addEventListener('click', (e) => deleteRelation(e.target.dataset.id));
    });
}

// Función para buscar restaurantes por tipo de comida
async function searchRestaurantsByFoodType() {
    const foodTypeId = foodTypeFilterSelect.value;
    
    if (!foodTypeId) {
        showNotification('Por favor, seleccione un tipo de comida', 'warning');
        return;
    }
    
    // Mostrar mensaje de carga
    restaurantsByFoodTypeResult.innerHTML = '<div class="alert alert-info">Cargando restaurantes...</div>';
    
    try {
        console.log('Buscando restaurantes para el tipo de comida ID:', foodTypeId);
        
        // Usando la ruta correcta que coincide con el backend
        const response = await axios.get(`${API_URL}/restaurantesByTipoC/${foodTypeId}`);
        console.log('Respuesta del servidor:', response);
        
        // Extraer los restaurantes de la respuesta
        let restaurants = [];
        if (response && response.data && response.data.data) {
            // Si la respuesta tiene un formato { data: { data: [...] } }
            restaurants = response.data.data;
        } else if (response && response.data) {
            // Si la respuesta es directamente un array o un objeto con datos
            restaurants = response.data;
        }
        
        displayRestaurantsByFoodType(restaurants, foodTypeFilterSelect.options[foodTypeFilterSelect.selectedIndex].text);
    } catch (error) {
        console.error('Error al buscar restaurantes por tipo de comida:', error);
        let errorMessage = 'Error al cargar los restaurantes';
        
        if (error.response) {
            errorMessage += `: ${error.response.status} - ${error.response.statusText}`;
            console.log('Datos de error:', error.response.data);
        }
        
        restaurantsByFoodTypeResult.innerHTML = `<div class="alert alert-danger">${errorMessage}</div>`;
    }
}

// Función para mostrar restaurantes por tipo de comida
function displayRestaurantsByFoodType(restaurants, foodTypeName) {
    if (!restaurants || restaurants.length === 0) {
        restaurantsByFoodTypeResult.innerHTML = `<div class="alert alert-info">No hay restaurantes con la categoría "${foodTypeName}"</div>`;
        return;
    }
    
    let html = `<h5>Restaurantes con categoría "${foodTypeName}"</h5>`;
    html += '<div class="row">';
    
    restaurants.forEach(restaurant => {
        const id = restaurant._id || restaurant.id || 'undefined';
        html += `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${restaurant.nombre}</h5>
                        <p class="card-text"><strong>Dirección:</strong> ${restaurant.direccion}</p>
                        <a href="#" class="btn btn-sm btn-primary view-restaurant-details" data-id="${id}">
                            Ver detalles
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    restaurantsByFoodTypeResult.innerHTML = html;
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.view-restaurant-details').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // Aquí puedes implementar la vista detallada del restaurante
            alert('Ver detalles del restaurante ' + e.target.dataset.id);
        });
    });
}

// Función para crear una nueva relación
async function saveRelation(event) {
    event.preventDefault();
    
    // Asegurar que estamos usando los IDs correctos
    const restauranteId = relationRestaurantSelect.value;
    const tipoComidaId = relationFoodTypeSelect.value;
    
    if (!restauranteId || !tipoComidaId) {
        showNotification('Por favor, seleccione un restaurante y un tipo de comida', 'warning');
        return;
    }
    
    const relationData = {
        restauranteId: restauranteId,
        tipoComidaId: tipoComidaId,
        enrollmentDate: new Date().toISOString()
    };
    
    try {
        await fetchAPI('/menu', 'POST', relationData);
        showNotification('Relación creada correctamente');
        
        // Cerrar modal y recargar datos
        relationModal.hide();
        resetRelationForm();
        loadRelations();
    } catch (error) {
        console.error('Error al guardar relación:', error);
    }
}

// Función para eliminar una relación
async function deleteRelation(id) {
    if (!confirm('¿Está seguro de eliminar esta relación?')) {
        return;
    }
    
    try {
        await fetchAPI(`/menu/${id}`, 'DELETE');
        showNotification('Relación eliminada correctamente');
        loadRelations();
    } catch (error) {
        console.error('Error al eliminar relación:', error);
    }
}

// Función para resetear el formulario
function resetRelationForm() {
    relationForm.reset();
    relationIdInput.value = '';
}

// Event listeners
relationForm.addEventListener('submit', saveRelation);

document.getElementById('add-relation-btn').addEventListener('click', () => {
    resetRelationForm();
});

searchByFoodTypeBtn.addEventListener('click', searchRestaurantsByFoodType);

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadRelations();
});
