// api.js - Manejo de comunicación con la API

// Configuración base para Axios
const API_URL = 'http://localhost:8000';
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.timeout = 10000; // 10 segundos de timeout

// Función para mostrar notificaciones
function showNotification(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    const toastBody = document.createElement('div');
    toastBody.className = 'toast-body d-flex';
    
    toastBody.innerHTML = `
        <div class="me-auto">${message}</div>
        <button type="button" class="btn-close btn-close-white ms-2" data-bs-dismiss="toast" aria-label="Close"></button>
    `;
    
    toast.appendChild(toastBody);
    
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        const container = document.createElement('div');
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(container);
        container.appendChild(toast);
    } else {
        toastContainer.appendChild(toast);
    }
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Eliminar el toast después de que se oculte
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

// Función genérica para realizar peticiones a la API usando Axios
async function fetchAPI(endpoint, method = 'GET', data = null) {
    try {
        console.log(`${method} request to: ${API_URL}${endpoint}`, data || '');
        
        // Asegurarnos que el endpoint comienza con /
        if (!endpoint.startsWith('/')) {
            endpoint = '/' + endpoint;
        }
        
        let response;
        
        // Configuración común para todas las peticiones
        const config = {
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        };
        
        if (method === 'GET') {
            response = await axios.get(endpoint, config);
        } else if (method === 'POST') {
            response = await axios.post(endpoint, data, config);
        } else if (method === 'PUT') {
            response = await axios.put(endpoint, data, config);
        } else if (method === 'DELETE') {
            response = await axios.delete(endpoint, config);
            return { success: true };
        } else {
            throw new Error(`Método HTTP no soportado: ${method}`);
        }
        
        console.log(`Respuesta exitosa de ${endpoint}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error en la petición API a ${endpoint}:`, error);
        let errorMessage = 'Error en la petición a la API';
        
        if (error.response) {
            // El servidor respondió con un código de error
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            
            // Manejo específico según el código de error
            switch (error.response.status) {
                case 400:
                    errorMessage = `Error de validación: ${
                        error.response.data.error || 'Los datos enviados no son válidos'
                    }`;
                    break;
                case 404:
                    errorMessage = `Recurso no encontrado: ${endpoint}`;
                    break;
                case 500:
                    errorMessage = 'Error interno del servidor. Intente nuevamente más tarde.';
                    break;
                default:
                    errorMessage = `Error ${error.response.status}: ${
                        error.response.data && error.response.data.message 
                            ? error.response.data.message 
                            : error.response.data && error.response.data.error
                                ? error.response.data.error
                                : 'Error en el servidor'
                    }`;
            }
        } else if (error.request) {
            // No se recibió respuesta
            console.error('No se recibió respuesta del servidor');
            errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión o si el servidor está en ejecución.';
        } else {
            // Error en la configuración de la petición
            errorMessage = error.message;
        }
        
        showNotification(errorMessage, 'danger');
        throw error;
    }
}
