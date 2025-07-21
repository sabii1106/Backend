// foodTypes.js - Manejo de tipos de comida

// Elementos del DOM
const foodTypesTableBody = document.getElementById('food-types-table-body');
const foodTypeForm = document.getElementById('food-type-form');
const foodTypeIdInput = document.getElementById('food-type-id');
const foodTypeNameInput = document.getElementById('food-type-name');
const foodTypeDescriptionInput = document.getElementById('food-type-description');
const foodTypeModal = new bootstrap.Modal(document.getElementById('foodTypeModal'));

// Función para cargar tipos de comida
async function loadFoodTypes() {
    try {
        const foodTypes = await fetchAPI('/tipo-comida');
        displayFoodTypes(foodTypes);
        updateFoodTypeDropdowns();
    } catch (error) {
        console.error('Error al cargar tipos de comida:', error);
    }
}

// Función para mostrar tipos de comida en la tabla
function displayFoodTypes(foodTypes) {
    foodTypesTableBody.innerHTML = '';
    
    if (!foodTypes || foodTypes.length === 0) {
        foodTypesTableBody.innerHTML = '<tr><td colspan="4" class="text-center">No hay tipos de comida disponibles</td></tr>';
        return;
    }
    
    foodTypes.forEach(foodType => {
        const row = document.createElement('tr');
        const id = foodType._id || foodType.id || 'undefined';
        row.innerHTML = `
            <td>${id}</td>
            <td>${foodType.nombre}</td>
            <td>${foodType.descripcion}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-primary edit-food-type" data-id="${id}">
                    <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-sm btn-danger delete-food-type" data-id="${id}">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </td>
        `;
        foodTypesTableBody.appendChild(row);
    });
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.edit-food-type').forEach(button => {
        button.addEventListener('click', (e) => editFoodType(e.target.dataset.id));
    });
    
    document.querySelectorAll('.delete-food-type').forEach(button => {
        button.addEventListener('click', (e) => deleteFoodType(e.target.dataset.id));
    });
}

// Función para actualizar los dropdowns de tipos de comida
function updateFoodTypeDropdowns() {
    const foodTypeSelects = document.querySelectorAll('#relation-food-type, #food-type-filter');
    
    fetchAPI('/tipo-comida')
        .then(foodTypes => {
            foodTypeSelects.forEach(select => {
                // Guardar el valor seleccionado actualmente
                const currentValue = select.value;
                
                // Vaciar el select excepto la primera opción
                const firstOption = select.options[0];
                select.innerHTML = '';
                select.appendChild(firstOption);
                
                // Agregar las nuevas opciones
                foodTypes.forEach(foodType => {
                    const option = document.createElement('option');
                    // Use _id or id, whichever is available
                    option.value = foodType._id || foodType.id;
                    option.textContent = foodType.nombre;
                    select.appendChild(option);
                });
                
                // Restaurar el valor seleccionado si existe
                if (currentValue) {
                    select.value = currentValue;
                }
            });
        })
        .catch(error => console.error('Error al actualizar dropdowns de tipos de comida:', error));
}

// Función para crear o actualizar un tipo de comida
async function saveFoodType(event) {
    event.preventDefault();
    
    const foodTypeData = {
        nombre: foodTypeNameInput.value,
        descripcion: foodTypeDescriptionInput.value
    };
    
    const foodTypeId = foodTypeIdInput.value;
    
    try {
        let result;
        if (foodTypeId) {
            // Actualizar tipo de comida existente
            result = await fetchAPI(`/tipo-comida/${foodTypeId}`, 'PUT', foodTypeData);
            showNotification('Tipo de comida actualizado correctamente');
        } else {
            // Crear nuevo tipo de comida
            result = await fetchAPI('/tipo-comida', 'POST', foodTypeData);
            showNotification('Tipo de comida creado correctamente');
        }
        
        // Cerrar modal y recargar datos
        foodTypeModal.hide();
        resetFoodTypeForm();
        loadFoodTypes();
    } catch (error) {
        console.error('Error al guardar tipo de comida:', error);
    }
}

// Función para editar un tipo de comida
async function editFoodType(id) {
    try {
        const foodType = await fetchAPI(`/tipo-comida/${id}`);
        
        // Use _id or id, whichever is available
        foodTypeIdInput.value = foodType._id || foodType.id;
        foodTypeNameInput.value = foodType.nombre;
        foodTypeDescriptionInput.value = foodType.descripcion;
        
        document.getElementById('foodTypeModalLabel').textContent = 'Editar Tipo de Comida';
        foodTypeModal.show();
    } catch (error) {
        console.error('Error al obtener datos del tipo de comida:', error);
    }
}

// Función para eliminar un tipo de comida
async function deleteFoodType(id) {
    if (!confirm('¿Está seguro de eliminar este tipo de comida?')) {
        return;
    }
    
    try {
        await fetchAPI(`/tipo-comida/${id}`, 'DELETE');
        showNotification('Tipo de comida eliminado correctamente');
        loadFoodTypes();
    } catch (error) {
        console.error('Error al eliminar tipo de comida:', error);
    }
}

// Función para resetear el formulario
function resetFoodTypeForm() {
    foodTypeForm.reset();
    foodTypeIdInput.value = '';
    document.getElementById('foodTypeModalLabel').textContent = 'Agregar Tipo de Comida';
}

// Event listeners
foodTypeForm.addEventListener('submit', saveFoodType);

document.getElementById('add-food-type-btn').addEventListener('click', () => {
    resetFoodTypeForm();
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadFoodTypes();
});
