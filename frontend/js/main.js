// main.js - Script principal

// Crear container para notificaciones
document.addEventListener('DOMContentLoaded', () => {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '11000'; // Asegurar que esté por encima de modales
    document.body.appendChild(toastContainer);
    
    // Verificar conexión con la API
    const testConnection = async () => {
        try {
            const response = await fetchAPI('/restaurantes');
            console.log('Conexión con la API exitosa:', response);
            showNotification('Conexión con el servidor establecida correctamente', 'success');
        } catch (error) {
            console.error('Error al conectar con la API:', error);
            showNotification('Error al conectar con el servidor. Verifique que el servidor esté en ejecución.', 'danger');
        }
    };
    
    // Ejecutar test de conexión
    setTimeout(testConnection, 1000);
    
    // Añadir íconos de Bootstrap
    const iconLink = document.createElement('link');
    iconLink.rel = 'stylesheet';
    iconLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css';
    document.head.appendChild(iconLink);
    
    // Activar los tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Navegación por pestañas
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remover la clase active de todos los enlaces
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            
            // Agregar la clase active al enlace clickeado
            link.classList.add('active');
            
            // Mostrar la sección correspondiente y ocultar las demás
            const targetId = link.getAttribute('href').substring(1);
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
    
    // Mostrar la primera sección por defecto
    navLinks[0].click();
});
